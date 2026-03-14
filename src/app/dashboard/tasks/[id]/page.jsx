"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Calendar,
  Clock,
  Flag,
  User,
  Tag,
  FileText,
  Mail,
  Phone,
  Users,
  AlertCircle,
} from "lucide-react";
import { getTaskById, deleteTask } from "@/app/action/server/tasksActions";

const Page = ({ params }) => {
  const router = useRouter();
  const [task, setTask] = useState(null);

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const data = await getTaskById(params.id);
      setTask(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load task'
      });
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete "${task?.title}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteTask(params.id);
        
        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Task has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          router.push('/dashboard/tasks');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete task'
        });
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-700 border-red-200';
      case 'Medium': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Not Started': return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'Completed': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCategoryIcon = (category) => {
    switch(category) {
      case 'Call': return <Phone className="w-5 h-5" />;
      case 'Email': return <Mail className="w-5 h-5" />;
      case 'Meeting': return <Users className="w-5 h-5" />;
      case 'Document': return <FileText className="w-5 h-5" />;
      default: return <Tag className="w-5 h-5" />;
    }
  };

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 w-full flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg mb-4">Task not found</p>
          <Link 
            href="/dashboard/tasks" 
            className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header - Full Width */}
      <div className="bg-white border-b border-gray-200 w-full sticky top-0 z-10">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/tasks" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Task Details</h1>
                <p className="text-sm text-gray-500">View complete task information</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push(`/dashboard/tasks/${params.id}/edit`)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors bg-white"
              >
                <Edit2 className="w-4 h-4 mr-2 text-gray-600" />
                Edit Task
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Task
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full p-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
          {/* Card Header */}
          <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#F97316]" />
              <h2 className="text-lg font-semibold text-gray-800">Task Information</h2>
            </div>
          </div>

          {/* Card Body */}
          <div className="p-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Title</label>
                  <p className="text-xl font-bold text-gray-900 mt-1">{task.title}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</label>
                  <p className="text-gray-700 mt-2 leading-relaxed">{task.description || 'No description provided'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> Due Date
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{task.dueDate}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <Clock className="w-3 h-3 mr-1" /> Due Time
                    </label>
                    <p className="text-lg font-semibold text-gray-900 mt-1">{task.dueTime}</p>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Status</label>
                    <div className="mt-2">
                      <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</label>
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getPriorityColor(task.priority)}`}>
                        <Flag className="w-3 h-3 mr-1" />
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</label>
                  <div className="flex items-center mt-3">
                    <div className="flex-1 h-2.5 bg-gray-200 rounded-full mr-3">
                      <div 
                        className="bg-[#F97316] h-2.5 rounded-full transition-all duration-300" 
                        style={{ width: `${task.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-bold text-gray-700">{task.progress}%</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <User className="w-3 h-3 mr-1" /> Assignee
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1">{task.assignee || 'Unassigned'}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center">
                      <Tag className="w-3 h-3 mr-1" /> Category
                    </label>
                    <p className="text-base font-semibold text-gray-900 mt-1 flex items-center">
                      {getCategoryIcon(task.category)}
                      <span className="ml-2">{task.category}</span>
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                  <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">Related To</label>
                  <p className="text-base font-semibold text-gray-900 mt-1">{task.relatedTo || 'None'}</p>
                </div>

                {(task.setReminder || task.emailNotification || task.isRecurring) && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">Settings</label>
                    <div className="flex flex-wrap gap-2">
                      {task.setReminder && (
                        <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium border border-purple-200">
                          🔔 Reminder Set
                        </span>
                      )}
                      {task.emailNotification && (
                        <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                          📧 Email Notifications
                        </span>
                      )}
                      {task.isRecurring && (
                        <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">
                          🔁 Recurring Task
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Card Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <Link
                href="/dashboard/tasks"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Back to Tasks
              </Link>
              <button
                onClick={() => router.push(`/dashboard/tasks/${params.id}/edit`)}
                className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors"
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;