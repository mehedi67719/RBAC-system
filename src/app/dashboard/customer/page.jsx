"use client";

import React from 'react';
import { User, Mail, Phone, Calendar, Clock, FileText, MessageSquare, HelpCircle, Settings, LogOut, Bell, Star, Shield } from 'lucide-react';

const Page = () => {
  const recentActivities = [
    { id: 1, type: 'ticket', title: 'Support Ticket #1234', description: 'Your ticket has been resolved', date: '2024-03-15', time: '2 hours ago' },
    { id: 2, type: 'message', title: 'New message from support', description: 'Response to your inquiry about pricing', date: '2024-03-14', time: '1 day ago' },
    { id: 3, type: 'update', title: 'Profile updated', description: 'Your contact information was updated', date: '2024-03-13', time: '2 days ago' },
    { id: 4, type: 'order', title: 'Order #5678', description: 'Your order has been shipped', date: '2024-03-12', time: '3 days ago' },
  ];

  const tickets = [
    { id: 1, subject: 'Login issue', status: 'Open', priority: 'High', lastUpdate: '2024-03-15' },
    { id: 2, subject: 'Billing question', status: 'In Progress', priority: 'Medium', lastUpdate: '2024-03-14' },
    { id: 3, subject: 'Feature request', status: 'Closed', priority: 'Low', lastUpdate: '2024-03-10' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Open': return 'bg-yellow-50 text-yellow-700';
      case 'In Progress': return 'bg-blue-50 text-blue-700';
      case 'Closed': return 'bg-green-50 text-green-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'text-red-600';
      case 'Medium': return 'text-orange-600';
      case 'Low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Customer Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold">
                JD
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-800">Welcome back, John!</h1>
                <p className="text-sm text-gray-500">Customer Portal</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Tickets</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <FileText className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Support Hours</p>
                <p className="text-2xl font-bold text-gray-900">24/7</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Clock className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Account Age</p>
                <p className="text-2xl font-bold text-gray-900">2 yrs</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile & Info */}
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <User className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">John Doe</span>
                </div>
                <div className="flex items-center text-sm">
                  <Mail className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">john.doe@example.com</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 text-gray-400 mr-3" />
                  <span className="text-gray-600">Member since March 2022</span>
                </div>
              </div>
              <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                Edit Profile
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  Create New Ticket
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  View Knowledge Base
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  Contact Support
                </button>
                <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                  Billing History
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Activities & Tickets */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-2 h-2 mt-2 rounded-full bg-blue-600"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-500">{activity.description}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Support Tickets */}
            <div className="bg-white rounded-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Support Tickets</h2>
                <button className="text-sm text-blue-600 hover:text-blue-700">View All</button>
              </div>
              <div className="space-y-3">
                {tickets.map((ticket) => (
                  <div key={ticket.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ticket.subject}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                        <span className={`text-xs ${getPriorityColor(ticket.priority)}`}>
                          {ticket.priority} Priority
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400">{ticket.lastUpdate}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Center */}
            <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
              <div className="flex items-start space-x-2">
                <HelpCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-900">Need help?</h3>
                  <p className="text-xs text-blue-700 mt-1">
                    Visit our help center for FAQs, guides, and tutorials. Support is available 24/7.
                  </p>
                  <button className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Go to Help Center →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;