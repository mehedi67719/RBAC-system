"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import { ObjectId } from "mongodb";

// Get all leads
export const getLeads = async () => {
  try {
    const col = await dbconnection("leads");
    const docs = await col.find({}).sort({ createdAt: -1 }).toArray();

    return docs.map((l) => ({
      id: l._id.toString(),
      name: l.companyName || l.name || '',
      contact: l.contactName || `${l.firstName || ''} ${l.lastName || ''}`.trim() || '',
      email: l.email || '',
      status: l.status || 'Cold',
      value: l.value ? `$${Number(l.value).toLocaleString()}` : "$0",
      stage: l.stage || 'Initial Contact',
      date: l.expectedCloseDate
        ? new Date(l.expectedCloseDate).toISOString().slice(0, 10)
        : new Date().toISOString().slice(0, 10),
    }));
  } catch (error) {
    console.error("Error in getLeads:", error);
    return [];
  }
};





export const createLead = async (formData, actor) => {
  try {
    const companyName = formData.get("companyName")?.toString().trim();
    const firstName = formData.get("firstName")?.toString().trim();
    const lastName = formData.get("lastName")?.toString().trim();
    const email = formData.get("email")?.toString().trim();
    const phone = formData.get("phone")?.toString().trim() || '';
    const status = formData.get("status")?.toString() || 'Cold';
    const stage = formData.get("stage")?.toString() || 'Initial Contact';
    const value = formData.get("value") ? parseFloat(formData.get("value")) : 0;
    const expectedCloseDate = formData.get("expectedCloseDate")?.toString() || null;

    if (!companyName || !firstName || !lastName || !email) {
      return { success: false, message: "Required fields missing" };
    }

    const col = await dbconnection("leads");

    const doc = {
      companyName,
      firstName,
      lastName,
      contactName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      status,
      stage,
      value,
      expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return { 
      success: true, 
      id: result.insertedId.toString(),
      message: "Lead created successfully"
    };
  } catch (error) {
    console.error("Error in createLead:", error);
    return { success: false, message: "Failed to create lead" };
  }
};