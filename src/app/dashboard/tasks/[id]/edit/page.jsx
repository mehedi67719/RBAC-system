"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Save,
  Calendar,
  Clock,
  Flag,
  User,
  Tag,
  FileText,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { getTaskById, updateTask } from "@/app/action/server/tasksActions";

const Page = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    dueTime: '',
    status: 'Not Started',
    priority: 'Medium',
    progress: 0,
    assignee: '',
    category: 'Task',
    relatedTo: '',
    setReminder: false,
    emailNotification: false,
    isRecurring: false,
  });

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const data = await getTaskById(params.id);
      if (data) {
        setFormData(data);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load task'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'setReminder' || key === 'emailNotification' || key === 'isRecurring') {
        formDataObj.append(key, formData[key] ? 'on' : '');
      } else {
        formDataObj.append(key, formData[key]);
      }
    });

    try {
      const result = await updateTask(params.id, formDataObj, {
        id: session?.user?.id,
        email: session?.user?.email,
      });

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Task updated successfully',
          timer: 2000,
          showConfirmButton: false
        });
        router.push('/dashboard/tasks');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          confirmButtonColor: '#F97316'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong',
        confirmButtonColor: '#F97316'
      });
    } finally {
      setLoading(false);
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-800">Edit Task</h1>
                <p className="text-sm text-gray-500">Update task information</p>
              </div>
            </div>
            <button
              type="submit"
              form="edit-task-form"
              disabled={loading}
              className="flex items-center px-6 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Update Task'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full p-6">
        <form id="edit-task-form" onSubmit={handleSubmit} className="w-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#F97316]" />
                <h2 className="text-lg font-semibold text-gray-800">Task Information</h2>
              </div>
            </div>

            {/* Form Body */}
            <div className="p-6 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      placeholder="Enter task title"
                    />
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white resize-none"
                      placeholder="Enter task description"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Due Date <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="dueDate"
                          value={formData.dueDate}
                          onChange={handleChange}
                          type="date"
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Due Time <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="dueTime"
                          value={formData.dueTime}
                          onChange={handleChange}
                          type="time"
                          required
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      >
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                        <option value="On Hold">On Hold</option>
                      </select>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Priority
                      </label>
                      <div className="relative">
                        <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="priority"
                          value={formData.priority}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                        >
                          <option value="High">High</option>
                          <option value="Medium">Medium</option>
                          <option value="Low">Low</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Progress ({formData.progress}%)
                    </label>
                    <input
                      name="progress"
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={handleChange}
                      className="w-full accent-[#F97316]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Assignee
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          name="assignee"
                          value={formData.assignee}
                          onChange={handleChange}
                          type="text"
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                          placeholder="John Doe"
                        />
                      </div>
                    </div>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Category
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                        >
                          <option value="Call">Call</option>
                          <option value="Email">Email</option>
                          <option value="Meeting">Meeting</option>
                          <option value="Document">Document</option>
                          <option value="Review">Review</option>
                          <option value="Admin">Admin</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Related To
                    </label>
                    <select
                      name="relatedTo"
                      value={formData.relatedTo}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                    >
                      <option value="">None</option>
                      <option value="Lead">Lead</option>
                      <option value="Customer">Customer</option>
                      <option value="Project">Project</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Additional Settings
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="setReminder"
                          checked={formData.setReminder}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                        />
                        <span className="text-sm text-gray-700">Set reminder</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="emailNotification"
                          checked={formData.emailNotification}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                        />
                        <span className="text-sm text-gray-700">Send email notification</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="isRecurring"
                          checked={formData.isRecurring}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                        />
                        <span className="text-sm text-gray-700">Mark as recurring task</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Link
                  href="/dashboard/tasks"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors bg-white"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  form="edit-task-form"
                  disabled={loading}
                  className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;