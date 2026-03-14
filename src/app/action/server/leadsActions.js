"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import { ObjectId } from "mongodb";




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





export const getLeadById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const col = await dbconnection("leads");
    const lead = await col.findOne({ _id: new ObjectId(id) });

    if (!lead) return null;

    return {
      id: lead._id.toString(),
      companyName: lead.companyName || '',
      firstName: lead.firstName || '',
      lastName: lead.lastName || '',
      email: lead.email || '',
      phone: lead.phone || '',
      status: lead.status || 'Cold',
      stage: lead.stage || 'Initial Contact',
      value: lead.value || 0,
      expectedCloseDate: lead.expectedCloseDate 
        ? new Date(lead.expectedCloseDate).toISOString().slice(0, 10)
        : '',
    };
  } catch (error) {
    console.error("Error in getLeadById:", error);
    return null;
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




export const updateLead = async (id, formData, actor) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid lead ID" };
    }

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

    const updateDoc = {
      $set: {
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
        updatedAt: new Date(),
      }
    };

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Lead not found" };
    }

    return { 
      success: true, 
      message: "Lead updated successfully" 
    };
  } catch (error) {
    console.error("Error in updateLead:", error);
    return { success: false, message: "Failed to update lead" };
  }
};




export const deleteLead = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid lead ID" };
    }

    const col = await dbconnection("leads");
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, message: "Lead not found" };
    }

    return { 
      success: true, 
      message: "Lead deleted successfully" 
    };
  } catch (error) {
    console.error("Error in deleteLead:", error);
    return { success: false, message: "Failed to delete lead" };
  }
};