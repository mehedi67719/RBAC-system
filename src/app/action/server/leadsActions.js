"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import { logAudit } from "./audit";

export const getLeads = async () => {
  const col = await dbconnection("leads");
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();

  return docs.map((l) => ({
    id: l._id.toString(),
    name: l.companyName,
    contact: l.contactName,
    email: l.email,
    phone: l.phone,
    status: l.status,
    value: l.value ? `$${l.value.toLocaleString()}` : "$0",
    stage: l.stage,
    date: l.expectedCloseDate
      ? new Date(l.expectedCloseDate).toISOString().slice(0, 10)
      : "",
  }));
};

export const createLead = async (formData, actor) => {
  const companyName = formData.get("companyName")?.toString().trim();
  const industry = formData.get("industry")?.toString() || "";
  const website = formData.get("website")?.toString() || "";
  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
  const email = formData.get("email")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const jobTitle = formData.get("jobTitle")?.toString() || "";
  const status = formData.get("status")?.toString() || "Warm";
  const stage = formData.get("stage")?.toString() || "Initial Contact";
  const value = Number(formData.get("value") || 0);
  const expectedCloseDate = formData.get("expectedCloseDate")?.toString() || "";
  const source = formData.get("source")?.toString() || "";
  const assignedTo = formData.get("assignedTo")?.toString() || "";
  const notes = formData.get("notes")?.toString() || "";

  if (!companyName || !firstName || !lastName || !email) {
    return { ok: false, message: "Required fields are missing." };
  }

  const col = await dbconnection("leads");
  const doc = {
    companyName,
    industry,
    website,
    contactName: `${firstName} ${lastName}`,
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    status,
    stage,
    value,
    expectedCloseDate: expectedCloseDate ? new Date(expectedCloseDate) : null,
    source,
    assignedTo,
    notes,
    createdAt: new Date(),
  };

  const result = await col.insertOne(doc);

  await logAudit({
    actorId: actor?.id || null,
    actorEmail: actor?.email || null,
    action: "leads.create",
    resource: "Leads",
    status: "Success",
    details: `Created lead ${companyName}`,
  });

  return { ok: true, id: result.insertedId.toString() };
};

