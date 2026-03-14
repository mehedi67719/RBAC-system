"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import { headers } from "next/headers";

export const logAudit = async ({
  actorId,
  actorEmail,
  action,
  resource,
  status = "Success",
  details = "",
}) => {
  try {
    const auditCollection = await dbconnection("audit_logs");
    const ip =
      headers().get("x-forwarded-for") ||
      headers().get("x-real-ip") ||
      "unknown";

    await auditCollection.insertOne({
      actorId,
      actorEmail,
      action,
      resource,
      status,
      details,
      ip,
      createdAt: new Date(),
    });
  } catch (e) {
    console.error("Failed to write audit log", e);
  }
};

