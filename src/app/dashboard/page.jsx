import DashboardHome from '@/Components/DashboardHome';
import Sidebar from '@/Components/Sidebar';
import React from 'react';

const page = () => {
    return (
        <div className="flex w-full h-screen bg-gray-50">
           
            <div className="w-full flex flex-col overflow-hidden">
             
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
                        <div className="flex items-center space-x-3">
                            <button className="p-2 hover:bg-gray-100 rounded-lg">
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                J
                            </div>
                        </div>
                    </div>
                </header>

                {/* Dashboard Content - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-500">Total Leads</h3>
                                    <span className="p-2 bg-blue-50 rounded-lg">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">127</div>
                                <div className="text-xs text-green-600 mt-2">↑ 12% from last month</div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-500">Active Tasks</h3>
                                    <span className="p-2 bg-green-50 rounded-lg">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">34</div>
                                <div className="text-xs text-orange-600 mt-2">8 due this week</div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-500">Reports</h3>
                                    <span className="p-2 bg-purple-50 rounded-lg">
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">15</div>
                                <div className="text-xs text-gray-500 mt-2">Last updated 2h ago</div>
                            </div>

                            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-medium text-gray-500">Customers</h3>
                                    <span className="p-2 bg-yellow-50 rounded-lg">
                                        <svg className="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </span>
                                </div>
                                <div className="text-2xl font-bold text-gray-900">2,451</div>
                                <div className="text-xs text-blue-600 mt-2">+180 this month</div>
                            </div>
                        </div>

                        {/* Charts and Tables Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Recent Activity */}
                            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                                <div className="space-y-4">
                                    {[1, 2, 3, 4].map((item) => (
                                        <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900">New lead added</p>
                                                    <p className="text-xs text-gray-500">John Doe • 2 hours ago</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-400">2h</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Upcoming Tasks */}
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Tasks</h2>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((item) => (
                                        <div key={item} className="p-3 bg-gray-50 rounded-lg">
                                            <p className="text-sm font-medium text-gray-900">Call with client</p>
                                            <p className="text-xs text-gray-500 mt-1">Today at 3:00 PM</p>
                                        </div>
                                    ))}
                                    <button className="w-full mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
                                        View all tasks →
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

export default page;