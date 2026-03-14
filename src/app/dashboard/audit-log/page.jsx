import React from 'react';
import { Search, Filter, Download, Calendar, User, Shield, AlertCircle, MoreVertical, Clock, Globe, Mail, Settings } from 'lucide-react';

const page = () => {
  const auditLogs = [
    { id: 1, user: 'John Doe', action: 'User Login', resource: 'Authentication', ip: '192.168.1.105', timestamp: '2024-03-15 09:23:45', status: 'Success', details: 'Login from Chrome on Windows' },
    { id: 2, user: 'Sarah Smith', action: 'Permission Update', resource: 'User Management', ip: '192.168.1.110', timestamp: '2024-03-15 10:15:22', status: 'Success', details: 'Modified permissions for Agent role' },
    { id: 3, user: 'Mike Johnson', action: 'Lead Created', resource: 'Leads', ip: '192.168.1.98', timestamp: '2024-03-15 11:05:33', status: 'Success', details: 'Created new lead: Acme Corporation' },
    { id: 4, user: 'Emily Brown', action: 'Task Deleted', resource: 'Tasks', ip: '192.168.1.115', timestamp: '2024-03-15 12:30:17', status: 'Warning', details: 'Deleted completed task #1245' },
    { id: 5, user: 'David Wilson', action: 'Failed Login', resource: 'Authentication', ip: '45.123.67.89', timestamp: '2024-03-15 13:42:08', status: 'Failed', details: 'Invalid password attempt (3 attempts)' },
    { id: 6, user: 'Sarah Smith', action: 'Report Generated', resource: 'Reports', ip: '192.168.1.110', timestamp: '2024-03-15 14:20:56', status: 'Success', details: 'Generated monthly sales report' },
    { id: 7, user: 'John Doe', action: 'Settings Changed', resource: 'Settings', ip: '192.168.1.105', timestamp: '2024-03-15 15:08:12', status: 'Success', details: 'Updated notification preferences' },
    { id: 8, user: 'Mike Johnson', action: 'Export Data', resource: 'Leads', ip: '192.168.1.98', timestamp: '2024-03-15 16:33:44', status: 'Success', details: 'Exported leads list to CSV' },
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'Success': return 'bg-green-50 text-green-700';
      case 'Warning': return 'bg-orange-50 text-orange-700';
      case 'Failed': return 'bg-red-50 text-red-700';
      default: return 'bg-gray-50 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Success': return <Shield className="w-3 h-3 mr-1" />;
      case 'Warning': return <AlertCircle className="w-3 h-3 mr-1" />;
      case 'Failed': return <AlertCircle className="w-3 h-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Audit Log</h1>
          <p className="text-sm text-gray-500 mt-1">Track all system activities and user actions</p>
        </div>
        <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4 mr-2 text-gray-600" />
          Export Logs
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">12,456</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Success</p>
              <p className="text-2xl font-bold text-gray-900">11,892</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2">95.5% of total</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Failed/Warning</p>
              <p className="text-2xl font-bold text-gray-900">564</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-xs text-red-600 mt-2">4.5% of total</p>
        </div>

        <div className="bg-white rounded-lg border border-gray-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Unique Users</p>
              <p className="text-2xl font-bold text-gray-900">24</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <User className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Active last 24h</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by user, action, resource, or IP..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Actions</option>
              <option value="login">Login</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="export">Export</option>
            </select>
            <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
            <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
              <Filter className="w-4 h-4 mr-2 text-gray-500" />
              More Filters
            </button>
          </div>
        </div>

        {/* Active Filters */}
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Active filters:</span>
          <span className="inline-flex items-center px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
            Last 24 hours
            <button className="ml-1 hover:text-blue-900">×</button>
          </span>
          <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            <button className="text-gray-500 hover:text-gray-700">Clear all</button>
          </span>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Timestamp</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Action</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Resource</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">IP Address</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3">Details</th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-3 h-3 mr-1 text-gray-400" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">
                        {log.user.charAt(0)}
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-600">{log.resource}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Globe className="w-3 h-3 mr-1 text-gray-400" />
                      {log.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(log.status)}`}>
                      {getStatusIcon(log.status)}
                      {log.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-gray-500 max-w-xs truncate">{log.details}</p>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing 1 to 8 of 12,456 events</p>
          <div className="flex space-x-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">Previous</button>
            <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">2</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">3</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">4</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">5</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-sm text-gray-600 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>

      {/* Real-time Activity */}
      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-blue-900">Real-time monitoring active</span>
          </div>
          <button className="text-xs text-blue-600 hover:text-blue-800">View live feed →</button>
        </div>
      </div>
    </div>
  );
};

export default page;