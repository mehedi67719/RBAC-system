"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Plus,
  RefreshCw
} from "lucide-react";
import { getTasks, deleteTask } from "@/app/action/server/tasksActions";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession(); // status will be 'loading', 'authenticated', or 'unauthenticated'
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const currentUserPermissions = session?.user?.permissions || [];
  const hasPermission = (permission) => currentUserPermissions.includes(permission);

  // Only fetch tasks once session is ready
  useEffect(() => {
    if (status === "authenticated" && hasPermission("tasks.view")) {
      fetchTasks();
    }
  }, [status, session]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load tasks" });
    } finally {
      setLoading(false);
    }
  };

  // ...handleDelete, handleEdit, handleView same as before

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-12 h-12 text-[#F97316] animate-spin" />
      </div>
    );
  }

  if (!hasPermission("tasks.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view tasks.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Tasks Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track your daily tasks</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={fetchTasks} className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50" title="Refresh">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          {hasPermission("tasks.create") && (
            <Link href="/dashboard/tasks/create" className="flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-500/20">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Link>
          )}
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {tasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 mb-3">No tasks found</div>
            {hasPermission("tasks.create") && (
              <Link
                href="/dashboard/tasks/create"
                className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </Link>
            )}
          </div>
        )}

        {/* Map your task cards here */}
        {tasks.map((task) => (
          <div key={task.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
            {/* Card content */}
            <div className="px-5 py-4">{task.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Page;