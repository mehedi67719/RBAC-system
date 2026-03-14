"use client";

import React, { useState } from "react";
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
  Paperclip,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { createTask } from "@/app/action/server/tasksActions";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const result = await createTask(formData, {
        id: session?.user?.id,
        email: session?.user?.email,
      });

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Task created successfully',
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
                <h1 className="text-2xl font-bold text-gray-800">Create New Task</h1>
                <p className="text-sm text-gray-500">Add a new task to your workflow</p>
              </div>
            </div>
            <button
              type="submit"
              form="create-task-form"
              disabled={loading}
              className="flex items-center px-6 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </div>
      </div>

      <div className="w-full p-6">
        <form id="create-task-form" onSubmit={handleSubmit} className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
            <div className="lg:col-span-2 space-y-6 w-full">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Task Details</h2>
                </div>
                <div className="p-6 w-full">
                  <div className="space-y-4 w-full">
                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Task Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="title"
                        type="text"
                        required
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                        placeholder="e.g., Call with client, Prepare proposal..."
                      />
                    </div>

                    <div className="w-full">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        rows="4"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white resize-none"
                        placeholder="Add detailed description of the task..."
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Date <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="dueDate"
                            type="date"
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Due Time <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            name="dueTime"
                            type="time"
                            required
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Attachments</h2>
                </div>
                <div className="p-6 w-full">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#F97316] transition-colors cursor-pointer bg-gray-50 hover:bg-orange-50">
                    <Paperclip className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-400 mt-2">PDF, DOC, Images (Max 10MB)</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 w-full">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Status & Priority</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select name="status" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white">
                      <option value="Not Started">Not Started</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select name="priority" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white">
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Progress
                    </label>
                    <input
                      name="progress"
                      type="range"
                      min="0"
                      max="100"
                      defaultValue="0"
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#F97316]"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Assignment</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Assignee
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select name="assignee" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white">
                        <option value="">Select team member</option>
                        <option value="John Doe">John Doe</option>
                        <option value="Sarah Smith">Sarah Smith</option>
                        <option value="Mike Johnson">Mike Johnson</option>
                        <option value="Emily Brown">Emily Brown</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select name="category" className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white">
                        <option value="Call">Call</option>
                        <option value="Email">Email</option>
                        <option value="Meeting">Meeting</option>
                        <option value="Document">Document</option>
                        <option value="Review">Review</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Related To
                    </label>
                    <select name="relatedTo" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white">
                      <option value="">None</option>
                      <option value="Lead">Lead</option>
                      <option value="Customer">Customer</option>
                      <option value="Project">Project</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
                <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-800">Reminder</h2>
                </div>
                <div className="p-6 space-y-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="setReminder" className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]" />
                    <span className="text-sm text-gray-700">Set reminder</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="emailNotification" className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]" />
                    <span className="text-sm text-gray-700">Send email notification</span>
                  </label>
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="checkbox" name="isRecurring" className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]" />
                    <span className="text-sm text-gray-700">Mark as recurring</span>
                  </label>
                </div>
              </div>

              <div className="bg-orange-50 rounded-xl border border-orange-200 p-5">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-semibold text-orange-800">Task Tips</h3>
                    <p className="text-xs text-orange-700 mt-1">
                      Break down large tasks into smaller subtasks for better tracking. Set realistic deadlines and priorities.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;