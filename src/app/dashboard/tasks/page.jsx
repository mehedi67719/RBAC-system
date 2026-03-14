"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  User,
  Tag,
  Flag,
  Phone,
  Mail,
  Users,
  FileText,
  Edit2,
  Trash2,
  Eye,
  RefreshCw
} from "lucide-react";
import { getTasks, deleteTask } from "@/app/action/server/tasksActions";

const Page = () => {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load tasks'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, title) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteTask(id);
        
        if (deleteResult.success) {
          setTasks(tasks.filter(task => task.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Task has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(deleteResult.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete task',
          confirmButtonColor: '#F97316'
        });
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/tasks/${id}/edit`);
  };

  const handleView = (id) => {
    router.push(`/dashboard/tasks/${id}`);
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-50 text-red-700 border-red-200';
      case 'Medium': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Low': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Not Started': return 'bg-gray-50 text-gray-700 border-gray-200';
      case 'Completed': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Call': return <Phone className="w-4 h-4" />;
      case 'Email': return <Mail className="w-4 h-4" />;
      case 'Meeting': return <Users className="w-4 h-4" />;
      case 'Document': return <FileText className="w-4 h-4" />;
      default: return <Tag className="w-4 h-4" />;
    }
  };

  // Calculate stats
  const totalTasks = tasks.length;
  const inProgress = tasks.filter(t => t.status === 'In Progress').length;
  const completed = tasks.filter(t => t.status === 'Completed').length;
  const overdue = tasks.filter(t => {
    const today = new Date();
    const dueDate = new Date(t.dueDate);
    return dueDate < today && t.status !== 'Completed';
  }).length;

  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase()) ||
    task.assignee?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-12 h-12 text-[#F97316] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 w-full">
        <div className="flex justify-between items-center w-full">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Tasks Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage and track your daily tasks</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={fetchTasks}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4 text-gray-600" />
            </button>
            <Link
              href="/dashboard/tasks/create"
              className="flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{inProgress}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{completed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Overdue</p>
              <p className="text-2xl font-bold text-gray-900">{overdue}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="px-6 pb-6 w-full">
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks by title, description or assignee..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
            />
          </div>
          <button className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            Filter
          </button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="px-6 pb-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
              {/* Card Header */}
              <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-transparent">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 mt-1 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]" 
                    />
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{task.title}</h3>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              {/* Card Body */}
              <div className="px-5 py-4 space-y-4">
                {/* Priority & Status */}
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                    <Flag className="w-3 h-3 mr-1" />
                    {task.priority}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
                    {task.status}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-medium text-gray-700">{task.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-[#F97316] h-1.5 rounded-full transition-all duration-300" 
                      style={{ width: `${task.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5 mr-2 text-gray-400" />
                    <span>Due: {task.dueDate} at {task.dueTime}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <User className="w-3.5 h-3.5 mr-2 text-gray-400" />
                    <span>Assigned to: {task.assignee || 'Unassigned'}</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Tag className="w-3.5 h-3.5 mr-2 text-gray-400" />
                    <span>{task.category} • {task.relatedTo || 'General'}</span>
                  </div>
                </div>

                {/* Reminder & Recurring */}
                {(task.setReminder || task.isRecurring) && (
                  <div className="flex items-center space-x-2 text-xs">
                    {task.setReminder && (
                      <span className="px-2 py-0.5 bg-purple-50 text-purple-600 rounded-full border border-purple-200">
                        🔔 Reminder
                      </span>
                    )}
                    {task.isRecurring && (
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-200">
                        🔁 Recurring
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Card Footer */}
              <div className="px-5 py-3 bg-gray-50 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-white text-gray-600 border border-gray-200">
                    {getCategoryIcon(task.category)}
                    <span className="ml-1">{task.category}</span>
                  </span>
                  <div className="flex items-center space-x-1">
                    <button 
                      onClick={() => handleView(task.id)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors text-blue-600"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(task.id)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors text-green-600"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(task.id, task.title)}
                      className="p-1.5 hover:bg-white rounded-lg transition-colors text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredTasks.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <div className="text-gray-400 mb-3">No tasks found</div>
            <Link
              href="/dashboard/tasks/create"
              className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Task
            </Link>
          </div>
        )}

        {/* Pagination */}
        {filteredTasks.length > 0 && (
          <div className="flex items-center justify-between mt-8 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Showing 1 to {filteredTasks.length} of {tasks.length} tasks
            </p>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 bg-[#F97316] text-white rounded-lg text-sm hover:bg-[#EA580C]">1</button>
              <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;