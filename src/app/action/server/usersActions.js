"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import { logAudit } from "./audit";
import { ObjectId } from "mongodb";

export const getUsers = async () => {
  try {
    const col = await dbconnection("users");

    const docs = await col
      .find({}, { projection: { password: 0 } })
      .sort({ createdAt: -1 })
      .toArray();

    return docs.map((u) => ({
      _id: u._id.toString(),
      firstName: u.firstName || u.name?.split(' ')[0] || '',
      lastName: u.lastName || u.name?.split(' ')[1] || '',
      name: u.name || '',
      email: u.email,
      phone: u.phone || '',
      username: u.username || '',
      role: u.role || "agent",
      status: u.status || "Active",
      emailVerified: u.emailVerified || false,
      permissions: u.permissions || [],
    }));
  } catch (error) {
    console.error("Error in getUsers:", error);
    return [];
  }
};

// Server Action for UPDATE
export const updateUser = async (id, updateData) => {
  try {
    console.log("Updating user with ID:", id);
    console.log("Update data:", updateData);

    // ID টি স্ট্রিং হিসেবে আসবে, তাই ObjectId তৈরি করুন
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      console.error("Invalid ObjectId:", id);
      return { success: false, message: "Invalid user ID format" };
    }

    const col = await dbconnection("users");

    // প্রথমে ইউজার আছে কিনা চেক করুন
    const existingUser = await col.findOne({ _id: objectId });
    if (!existingUser) {
      console.log("User not found with ID:", id);
      return { success: false, message: "User not found" };
    }

    const updateFields = {};
    if (updateData.role !== undefined) updateFields.role = updateData.role;
    if (updateData.permissions !== undefined) updateFields.permissions = updateData.permissions;
    if (updateData.status !== undefined) updateFields.status = updateData.status;

    console.log("Update fields:", updateFields);

    const result = await col.updateOne(
      { _id: objectId },
      { $set: updateFields }
    );

    console.log("Update result:", result);

    if (result.matchedCount === 0) {
      return { success: false, message: "User not found" };
    }

    // আপডেট করা ইউজার ফেচ করুন
    const updatedUser = await col.findOne(
      { _id: objectId },
      { projection: { password: 0 } }
    );

    console.log("Updated user:", updatedUser);

    return {
      success: true,
      data: {
        _id: updatedUser._id.toString(),
        firstName: updatedUser.firstName || updatedUser.name?.split(' ')[0] || '',
        lastName: updatedUser.lastName || updatedUser.name?.split(' ')[1] || '',
        role: updatedUser.role,
        status: updatedUser.status,
        permissions: updatedUser.permissions || [],
      }
    };
  } catch (error) {
    console.error("Error in updateUser:", error);
    return { success: false, message: error.message };
  }
};

// Server Action for DELETE
export const deleteUser = async (id) => {
  try {
    console.log("Deleting user with ID:", id);

    // ID টি স্ট্রিং হিসেবে আসবে, তাই ObjectId তৈরি করুন
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch (err) {
      console.error("Invalid ObjectId:", id);
      return { success: false, message: "Invalid user ID format" };
    }

    const col = await dbconnection("users");

    // প্রথমে ইউজার আছে কিনা চেক করুন
    const user = await col.findOne({ _id: objectId });
    if (!user) {
      console.log("User not found with ID:", id);
      return { success: false, message: "User not found" };
    }

    const result = await col.deleteOne({ _id: objectId });

    if (result.deletedCount === 0) {
      return { success: false, message: "User not found" };
    }

    console.log("User deleted successfully:", id);

    return { 
      success: true, 
      message: "User deleted successfully",
      data: {
        email: user.email,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim()
      }
    };
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return { success: false, message: error.message };
  }
};

export const createUser = async (formData, actor) => {
  try {
    const name = formData.get("name")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();
    const role = formData.get("role")?.toString() || "agent";
    const phone = formData.get("phone")?.toString().trim() || "";
    const username = formData.get("username")?.toString().trim() || email?.split('@')[0];

    if (!name || !email || !password) {
      return { success: false, message: "Name, email, and password are required." };
    }

    const col = await dbconnection("users");
    const exists = await col.findOne({ email });
    
    if (exists) {
      return { success: false, message: "User with this email already exists." };
    }

    // Split name into first and last
    const nameParts = name.split(' ');
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    const doc = {
      firstName,
      lastName,
      name,
      email,
      phone,
      username,
      password, // Note: Hash this password in production
      role,
      permissions: getDefaultPermissions(role),
      status: "Active",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);

    // Log audit (optional)
    try {
      await logAudit({
        actorId: actor?.id || null,
        actorEmail: actor?.email || null,
        action: "users.create",
        resource: "Users",
        status: "Success",
        details: `Created user ${email}`,
      });
    } catch (auditError) {
      console.error("Audit log error:", auditError);
    }

    return { 
      success: true, 
      id: result.insertedId.toString(),
      message: "User created successfully"
    };
  } catch (error) {
    console.error("Error in createUser:", error);
    return { success: false, message: "Failed to create user" };
  }
};

function getDefaultPermissions(role) {
  switch(role) {
    case "admin":
      return [
        "dashboard.view",
        "users.view", "users.create", "users.edit", "users.delete",
        "leads.view", "leads.create", "leads.edit", "leads.delete",
        "tasks.view", "tasks.create", "tasks.edit", "tasks.delete",
        "reports.view", "reports.generate",
        "audit.view", "permissions.manage", "settings.manage",
        "customer.view"
      ];
    case "manager":
      return [
        "dashboard.view",
        "users.view",
        "leads.view", "leads.create", "leads.edit",
        "tasks.view", "tasks.create", "tasks.edit",
        "reports.view",
        "audit.view",
        "customer.view"
      ];
    case "agent":
      return [
        "dashboard.view",
        "leads.view", "leads.create",
        "tasks.view", "tasks.create",
        "customer.view"
      ];
    default:
      return ["dashboard.view", "customer.view"];
  }
}