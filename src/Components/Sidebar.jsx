"use client";

import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase,
  CheckSquare,
  UserPlus,
  Calendar,
  Bell,
  FileText,
  Mail,
  MessageSquare,
  Settings,
  HelpCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto font-sans">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="text-sm text-gray-900">John's workspace</div>
        <div className="text-xs text-gray-500 mt-0.5">#WID12446875</div>
      </div>

      {/* Main Navigation */}
      <div className="py-2">
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Dashboard</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Leads</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Opportunities</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Tasks</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Assignments</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Calendar</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Reminders</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Reports</div>
      </div>

      {/* Users Section */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-1.5 text-xs text-gray-500 mt-2">Users</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Users</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Contacts</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Messages</div>
      </div>

      {/* Other Section */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-1.5 text-xs text-gray-500 mt-2">Other</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Configuration</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Invoice</div>
      </div>

      {/* Help Section */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer mt-2">Help center</div>
        <div className="px-4 py-1.5 text-sm text-gray-700 hover:bg-gray-50 cursor-pointer">Settings</div>
      </div>

      {/* Search Box */}
      <div className="border-t border-gray-200 mt-4">
        <div className="px-4 py-3">
          <div className="text-xs text-gray-500 mb-2">Search tab</div>
          <input
            type="text"
            placeholder="Search"
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Group 1 */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="text-xs text-gray-500 mb-2">Group 1</div>
          <div className="space-y-2">
            <div className="text-sm text-gray-700">Title</div>
            <div className="text-sm text-gray-700">Call about</div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-700">Send on/off</span>
              <div className="w-8 h-4 bg-gray-300 rounded-full relative cursor-pointer">
                <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-white rounded-full"></div>
              </div>
            </div>
            <div className="text-sm text-gray-700">Follow up</div>
            <div className="text-sm text-gray-700">Prepare for next meeting</div>
          </div>
        </div>
      </div>

      {/* Group 2 */}
      <div className="border-t border-gray-200">
        <div className="px-4 py-2">
          <div className="text-xs text-gray-500 mb-2">Group 2</div>
          <div className="space-y-3">
            <div className="text-sm text-gray-700">Backlog</div>
            <div className="text-sm text-gray-700">Call about</div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Client name:</span>
              <input
                type="text"
                className="flex-1 px-2 py-0.5 text-sm border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center">
              <span className="text-sm text-red-600 font-medium">Urgent</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">Project completion date:</span>
              <span className="text-sm text-gray-500">2024-12-31</span>
            </div>
            <div className="text-sm text-gray-700">Follow up</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;