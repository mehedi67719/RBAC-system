"use server";

import { dbconnection } from "@/Components/lib/dbconnection";
import { ObjectId } from "mongodb";

// Get all tasks
export const getTasks = async () => {
  try {
    const col = await dbconnection("tasks");
    const docs = await col.find({}).sort({ dueDate: 1 }).toArray();

    return docs.map((t) => ({
      id: t._id.toString(),
      title: t.title || '',
      description: t.description || '',
      dueDate: t.dueDate || '',
      dueTime: t.dueTime || '',
      status: t.status || 'Not Started',
      priority: t.priority || 'Medium',
      progress: t.progress || 0,
      assignee: t.assignee || '',
      category: t.category || 'Task',
      relatedTo: t.relatedTo || '',
      setReminder: t.setReminder || false,
      emailNotification: t.emailNotification || false,
      isRecurring: t.isRecurring || false,
    }));
  } catch (error) {
    console.error("Error in getTasks:", error);
    return [];
  }
};

// Get single task by ID
export const getTaskById = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    const col = await dbconnection("tasks");
    const task = await col.findOne({ _id: new ObjectId(id) });

    if (!task) return null;

    return {
      id: task._id.toString(),
      title: task.title || '',
      description: task.description || '',
      dueDate: task.dueDate || '',
      dueTime: task.dueTime || '',
      status: task.status || 'Not Started',
      priority: task.priority || 'Medium',
      progress: task.progress || 0,
      assignee: task.assignee || '',
      category: task.category || 'Task',
      relatedTo: task.relatedTo || '',
      setReminder: task.setReminder || false,
      emailNotification: task.emailNotification || false,
      isRecurring: task.isRecurring || false,
    };
  } catch (error) {
    console.error("Error in getTaskById:", error);
    return null;
  }
};

// Create new task
export const createTask = async (formData, actor) => {
  try {
    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || '';
    const dueDate = formData.get("dueDate")?.toString();
    const dueTime = formData.get("dueTime")?.toString();
    const status = formData.get("status")?.toString() || 'Not Started';
    const priority = formData.get("priority")?.toString() || 'Medium';
    const progress = parseInt(formData.get("progress")) || 0;
    const assignee = formData.get("assignee")?.toString() || '';
    const category = formData.get("category")?.toString() || 'Task';
    const relatedTo = formData.get("relatedTo")?.toString() || '';
    const setReminder = formData.get("setReminder") === 'on';
    const emailNotification = formData.get("emailNotification") === 'on';
    const isRecurring = formData.get("isRecurring") === 'on';

    if (!title || !dueDate || !dueTime) {
      return { success: false, message: "Title, due date and time are required" };
    }

    const col = await dbconnection("tasks");

    const doc = {
      title,
      description,
      dueDate,
      dueTime,
      status,
      priority,
      progress,
      assignee,
      category,
      relatedTo,
      setReminder,
      emailNotification,
      isRecurring,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await col.insertOne(doc);

    return { 
      success: true, 
      id: result.insertedId.toString(),
      message: "Task created successfully"
    };
  } catch (error) {
    console.error("Error in createTask:", error);
    return { success: false, message: "Failed to create task" };
  }
};

// Update task
export const updateTask = async (id, formData, actor) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid task ID" };
    }

    const title = formData.get("title")?.toString().trim();
    const description = formData.get("description")?.toString().trim() || '';
    const dueDate = formData.get("dueDate")?.toString();
    const dueTime = formData.get("dueTime")?.toString();
    const status = formData.get("status")?.toString() || 'Not Started';
    const priority = formData.get("priority")?.toString() || 'Medium';
    const progress = parseInt(formData.get("progress")) || 0;
    const assignee = formData.get("assignee")?.toString() || '';
    const category = formData.get("category")?.toString() || 'Task';
    const relatedTo = formData.get("relatedTo")?.toString() || '';
    const setReminder = formData.get("setReminder") === 'on';
    const emailNotification = formData.get("emailNotification") === 'on';
    const isRecurring = formData.get("isRecurring") === 'on';

    if (!title || !dueDate || !dueTime) {
      return { success: false, message: "Title, due date and time are required" };
    }

    const col = await dbconnection("tasks");

    const updateDoc = {
      $set: {
        title,
        description,
        dueDate,
        dueTime,
        status,
        priority,
        progress,
        assignee,
        category,
        relatedTo,
        setReminder,
        emailNotification,
        isRecurring,
        updatedAt: new Date(),
      }
    };

    const result = await col.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.matchedCount === 0) {
      return { success: false, message: "Task not found" };
    }

    return { 
      success: true, 
      message: "Task updated successfully" 
    };
  } catch (error) {
    console.error("Error in updateTask:", error);
    return { success: false, message: "Failed to update task" };
  }
};

// Delete task
export const deleteTask = async (id) => {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, message: "Invalid task ID" };
    }

    const col = await dbconnection("tasks");
    const result = await col.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, message: "Task not found" };
    }

    return { 
      success: true, 
      message: "Task deleted successfully" 
    };
  } catch (error) {
    console.error("Error in deleteTask:", error);
    return { success: false, message: "Failed to delete task" };
  }
};