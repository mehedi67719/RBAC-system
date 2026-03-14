import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Calendar, Clock, Flag, User, Tag, FileText, AlertCircle, Paperclip } from 'lucide-react';

const page = () => {
    return (
        <div className="p-6">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <Link
                        href="/tasks"
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-800">Create New Task</h1>
                        <p className="text-sm text-gray-500 mt-1">Add a new task to your workflow</p>
                    </div>
                </div>
                <button
                    type="submit"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    <Save className="w-4 h-4 mr-2" />
                    Save Task
                </button>
            </div>

            {/* Main Form */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Main Information */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Task Details Card */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Task Details</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Task Title <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Call with client, Prepare proposal..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows="4"
                                    placeholder="Add detailed description of the task..."
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Date <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="date"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Due Time
                                    </label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input
                                            type="time"
                                            className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Attachments Card */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Attachments</h2>
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                            <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                            <p className="text-xs text-gray-400 mt-1">PDF, DOC, Images (Max 10MB)</p>
                        </div>
                    </div>
                </div>

                {/* Right Column - Task Settings */}
                <div className="space-y-6">
                    {/* Status & Priority Card */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Status & Priority</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="not-started">Not Started</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                    <option value="on-hold">On Hold</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Priority
                                </label>
                                <div className="relative">
                                    <Flag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="high">High</option>
                                        <option value="medium">Medium</option>
                                        <option value="low">Low</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Progress
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value="0"
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assignment Card */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Assignment</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Assignee
                                </label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Select team member</option>
                                        <option value="john">John Doe</option>
                                        <option value="sarah">Sarah Smith</option>
                                        <option value="mike">Mike Johnson</option>
                                        <option value="emily">Emily Brown</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <div className="relative">
                                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <select className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                        <option value="">Select category</option>
                                        <option value="call">Call</option>
                                        <option value="email">Email</option>
                                        <option value="meeting">Meeting</option>
                                        <option value="document">Document</option>
                                        <option value="review">Review</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Related To
                                </label>
                                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                                    <option value="">None</option>
                                    <option value="lead">Lead</option>
                                    <option value="customer">Customer</option>
                                    <option value="project">Project</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Reminder Card */}
                    <div className="bg-white rounded-lg border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Reminder</h2>
                        <div className="space-y-3">
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700">Set reminder</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700">Send email notification</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                                <span className="text-sm text-gray-700">Mark as recurring</span>
                            </label>
                        </div>
                    </div>

                    {/* Tips Card */}
                    <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
                        <div className="flex items-start space-x-2">
                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                            <div>
                                <h3 className="text-sm font-semibold text-blue-900">Task Tips</h3>
                                <p className="text-xs text-blue-700 mt-1">
                                    Break down large tasks into smaller subtasks for better tracking. Set realistic deadlines and priorities.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default page;