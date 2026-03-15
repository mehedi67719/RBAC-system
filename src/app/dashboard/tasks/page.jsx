"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Plus,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle
} from "lucide-react";
import { getTasks, deleteTask, updateTask } from "@/app/action/server/tasksActions";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const currentUserPermissions = session?.user?.permissions || [];
  const currentUserRole = session?.user?.role;
  
  const hasPermission = (permission) => {
    if (currentUserRole === 'admin') return true;
    return currentUserPermissions.includes(permission);
  };

  useEffect(() => {
    if (status === "authenticated") {
      if (hasPermission("tasks.view")) {
        fetchTasks();
      } else {
        setLoading(false);
      }
    }
  }, [status, session]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data || []);
    } catch (error) {
      Swal.fire({ icon: "error", title: "Error", text: "Failed to load tasks" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId, taskTitle) => {
    if (!hasPermission("tasks.delete")) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You do not have permission to delete tasks', confirmButtonColor: '#F97316' });
      return;
    }

    const result = await Swal.fire({
      title: 'Delete Task?',
      text: `Are you sure you want to delete "${taskTitle}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setUpdatingTaskId(taskId);
        const deleteResult = await deleteTask(taskId);
        if (!deleteResult.success) throw new Error(deleteResult.message);
        setTasks(prev => prev.filter(task => task._id !== taskId));
        Swal.fire({ icon: 'success', title: 'Deleted!', text: 'Task deleted successfully', timer: 2000, showConfirmButton: false });
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to delete task', confirmButtonColor: '#F97316' });
        fetchTasks();
      } finally {
        setUpdatingTaskId(null);
      }
    }
  };

  const handleStatusChange = async (taskId, currentStatus) => {
    if (!hasPermission("tasks.edit")) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You do not have permission to update tasks', confirmButtonColor: '#F97316' });
      return;
    }

    const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
    
    try {
      setUpdatingTaskId(taskId);
      const result = await updateTask(taskId, { status: newStatus });
      if (!result.success) throw new Error(result.message);
      setTasks(prev => prev.map(task => task._id === taskId ? { ...task, status: newStatus } : task));
      Swal.fire({ icon: 'success', title: 'Success', text: `Task marked as ${newStatus}`, timer: 2000, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message || 'Failed to update task status', confirmButtonColor: '#F97316' });
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const handleView = (taskId) => {
    router.push(`/dashboard/tasks/${taskId}`);
  };

  const handleEdit = (taskId) => {
    if (!hasPermission("tasks.edit")) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You do not have permission to edit tasks', confirmButtonColor: '#F97316' });
      return;
    }
    router.push(`/dashboard/tasks/${taskId}/edit`);
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title?.toLowerCase().includes(search.toLowerCase()) ||
                         task.description?.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || task.status === filter;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-50 text-green-700 border-green-200';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-12 h-12 text-[#F97316] animate-spin" />
      </div>
    );
  }

  if (!hasPermission("tasks.view")) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto bg-white p-8 rounded-xl shadow-lg">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">You don't have permission to view tasks.</p>
          <Link href="/dashboard" className="inline-block px-6 py-3 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      <div className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tasks Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your daily tasks</p>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchTasks} 
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" 
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            {hasPermission("tasks.create") && (
              <Link 
                href="/dashboard/tasks/create" 
                className="flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Link>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316]"
          >
            <option value="all">All Tasks</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="px-4 md:px-6 py-6">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 mb-3">No tasks found</div>
            {hasPermission("tasks.create") && (
              <Link
                href="/dashboard/tasks/create"
                className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Task
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTasks.map((task) => (
              <div 
                key={task._id} 
                className={`bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${updatingTaskId === task._id ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className="px-5 py-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">{task.title}</h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1 capitalize">{task.status}</span>
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description || 'No description'}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => handleView(task._id)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                      title="View Task"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {hasPermission("tasks.edit") && (
                      <>
                        <button
                          onClick={() => handleEdit(task._id)}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                          title="Edit Task"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button
                          onClick={() => handleStatusChange(task._id, task.status)}
                          className="p-2 hover:bg-yellow-50 rounded-lg transition-colors text-yellow-600"
                          title={task.status === 'pending' ? 'Mark as Completed' : 'Mark as Pending'}
                        >
                          {task.status === 'pending' ? <CheckCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </button>
                      </>
                    )}
                    
                    {hasPermission("tasks.delete") && (
                      <button
                        onClick={() => handleDelete(task._id, task.title)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                        title="Delete Task"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;