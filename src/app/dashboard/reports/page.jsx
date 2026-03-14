import React from 'react';
import Link from 'next/link';
import { 
  Download, 
  Calendar, 
  Filter, 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Users, 
  Target, 
  DollarSign, 
  Activity,
  Plus,
  Eye,
  Share2,
  FileText,
  Clock
} from 'lucide-react';
import { getReports } from '@/app/action/server/reportsActions';

const Page = async () => {
  const reports = await getReports();

  const getStatusColor = (status) => {
    switch(status) {
      case 'Generated': return 'bg-green-50 text-green-700 border-green-200';
      case 'Pending': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'Processing': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'Sales': return <TrendingUp className="w-4 h-4" />;
      case 'Leads': return <Users className="w-4 h-4" />;
      case 'Revenue': return <DollarSign className="w-4 h-4" />;
      case 'Performance': return <Activity className="w-4 h-4" />;
      case 'Customers': return <Users className="w-4 h-4" />;
      case 'Tasks': return <Clock className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  // Calculate stats
  const totalReports = reports.length;
  const generated = reports.filter(r => r.status === 'Generated').length;
  const pending = reports.filter(r => r.status === 'Pending').length;
  const processing = reports.filter(r => r.status === 'Processing').length;

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header - Full Width */}
      <div className="bg-white border-b border-gray-200 w-full sticky top-0 z-10">
        <div className="w-full px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Reports</h1>
              <p className="text-sm text-gray-500 mt-1">View and download your reports</p>
            </div>
            <Link
              href="/dashboard/reports/create"
              className="flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors shadow-lg shadow-orange-500/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Report
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Reports</p>
                <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Activity className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Generated</p>
                <p className="text-2xl font-bold text-gray-900">{generated}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pending}</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <PieChart className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <p className="text-2xl font-bold text-gray-900">{processing}</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              This Month
            </button>
            <button className="flex items-center px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 bg-white">
              <Filter className="w-4 h-4 mr-2 text-gray-400" />
              Filter
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white">
              <BarChart3 className="w-4 h-4 text-gray-600" />
            </button>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 bg-white">
              <PieChart className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Report Name</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Type</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Date Range</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Format</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Status</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Size</th>
                  <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">{report.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-400">{getTypeIcon(report.type)}</span>
                        <span className="text-sm text-gray-600">{report.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-2 text-gray-400" />
                        {report.dateRange}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{report.format}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{report.size}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-600" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-green-50 rounded-lg transition-colors text-green-600" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 hover:bg-purple-50 rounded-lg transition-colors text-purple-600" title="Share">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {reports.length > 0 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">
                Showing 1 to {reports.length} of {reports.length} reports
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 bg-white" disabled>
                  Previous
                </button>
                <button className="px-3 py-1.5 bg-[#F97316] text-white rounded-lg text-sm hover:bg-[#EA580C]">1</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 bg-white">2</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 bg-white">3</button>
                <button className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-100 bg-white">Next</button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {reports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg mb-4">No reports found</p>
              <Link
                href="/dashboard/reports/create"
                className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Report
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;