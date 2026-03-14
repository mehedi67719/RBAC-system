"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import { logAudit } from "./audit";

export const getTasks = async () => {
  const col = await dbconnection("tasks");
  const docs = await col.find({}).sort({ createdAt: -1 }).toArray();

  return docs.map((t) => ({
    id: t._id.toString(),
    title: t.title,
    priority: t.priority || "Medium",
    status: t.status || "Not Started",
    dueDate: t.dueDate
      ? new Date(t.dueDate).toISOString().slice(0, 10)
      : "",
    assignee: t.assignee || "Unassigned",
    category: t.category || "General",
  }));
};

export const createTask = async (formData, actor) => {
  const title = formData.get("title")?.toString().trim();
  const description = formData.get("description")?.toString() || "";
  const dueDate = formData.get("dueDate")?.toString() || "";
  const dueTime = formData.get("dueTime")?.toString() || "";
  const status = formData.get("status")?.toString() || "not-started";
  const priority = formData.get("priority")?.toString() || "medium";
  const assignee = formData.get("assignee")?.toString() || "";
  const category = formData.get("category")?.toString() || "";
  const relatedTo = formData.get("relatedTo")?.toString() || "";

  if (!title) {
    return { ok: false, message: "Task title is required." };
  }

  const col = await dbconnection("tasks");
  const doc = {
    title,
    description,
    dueDate: dueDate ? new Date(`${dueDate}T${dueTime || "00:00"}:00Z`) : null,
    status,
    priority,
    assignee,
    category,
    relatedTo,
    createdAt: new Date(),
  };

  const result = await col.insertOne(doc);

  await logAudit({
    actorId: actor?.id || null,
    actorEmail: actor?.email || null,
    action: "tasks.create",
    resource: "Tasks",
    status: "Success",
    details: `Created task '${title}'`,
  });

  return { ok: true, id: result.insertedId.toString() };
};

