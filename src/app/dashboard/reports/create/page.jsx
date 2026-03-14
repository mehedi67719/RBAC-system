"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Save,
  Calendar,
  FileText,
  PieChart,
  BarChart3,
  Users,
  Target,
  DollarSign,
  Filter,
} from "lucide-react";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    reportName: '',
    reportType: 'Sales',
    dateRange: 'Last 30 Days',
    format: 'PDF',
    includeCharts: true,
    includeTables: true,
    sendEmail: false,
  });

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

    // Simulate API call
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Report generation started',
        timer: 2000,
        showConfirmButton: false
      });
      router.push('/dashboard/reports');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header - Full Width */}
      <div className="bg-white border-b border-gray-200 w-full sticky top-0 z-10">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Link 
                href="/dashboard/reports" 
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Create New Report</h1>
                <p className="text-sm text-gray-500">Generate custom reports with your data</p>
              </div>
            </div>
            <button
              type="submit"
              form="create-report-form"
              disabled={loading}
              className="flex items-center px-6 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="w-full p-6">
        <form id="create-report-form" onSubmit={handleSubmit} className="w-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
            {/* Form Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200 w-full">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#F97316]" />
                <h2 className="text-lg font-semibold text-gray-800">Report Configuration</h2>
              </div>
            </div>

            {/* Form Body - Full Width */}
            <div className="p-6 w-full">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
                {/* Left Column */}
                <div className="space-y-6 w-full">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Report Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="reportName"
                      value={formData.reportName}
                      onChange={handleChange}
                      type="text"
                      required
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      placeholder="e.g., Monthly Sales Report"
                    />
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Report Type
                    </label>
                    <select
                      name="reportType"
                      value={formData.reportType}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                    >
                      <option value="Sales">Sales Report</option>
                      <option value="Leads">Lead Analysis</option>
                      <option value="Revenue">Revenue Report</option>
                      <option value="Performance">Performance Report</option>
                      <option value="Customers">Customer Activity</option>
                      <option value="Tasks">Task Analysis</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Date Range
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select
                        name="dateRange"
                        value={formData.dateRange}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      >
                        <option value="Today">Today</option>
                        <option value="Yesterday">Yesterday</option>
                        <option value="Last 7 Days">Last 7 Days</option>
                        <option value="Last 30 Days">Last 30 Days</option>
                        <option value="This Month">This Month</option>
                        <option value="Last Month">Last Month</option>
                        <option value="This Quarter">This Quarter</option>
                        <option value="Custom Range">Custom Range</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6 w-full">
                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Format
                    </label>
                    <select
                      name="format"
                      value={formData.format}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="Excel">Excel Spreadsheet</option>
                      <option value="CSV">CSV File</option>
                      <option value="JSON">JSON Data</option>
                    </select>
                  </div>

                  <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Report Options
                    </label>
                    <div className="space-y-3">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="includeCharts"
                          checked={formData.includeCharts}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                        />
                        <span className="text-sm text-gray-700">Include charts and graphs</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="includeTables"
                          checked={formData.includeTables}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                        />
                        <span className="text-sm text-gray-700">Include data tables</span>
                      </label>
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="sendEmail"
                          checked={formData.sendEmail}
                          onChange={handleChange}
                          className="w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                        />
                        <span className="text-sm text-gray-700">Send to email when ready</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Preview Section - Full Width */}
              <div className="mt-8 p-5 bg-orange-50 rounded-lg border border-orange-200 w-full">
                <h3 className="text-sm font-medium text-orange-800 mb-3 flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Report Preview
                </h3>
                <p className="text-sm text-orange-700 leading-relaxed">
                  You are about to generate a <span className="font-semibold">{formData.reportType}</span> report 
                  for <span className="font-semibold">{formData.dateRange}</span> in <span className="font-semibold">{formData.format}</span> format.
                  {formData.includeCharts && ' Charts will be included.'}
                  {formData.includeTables && ' Tables will be included.'}
                  {formData.sendEmail && ' Report will be sent to your email when ready.'}
                </p>
              </div>
            </div>

            {/* Form Footer - Full Width */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 w-full">
              <div className="flex justify-end space-x-3">
                <Link
                  href="/dashboard/reports"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors bg-white"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Generating...' : 'Generate Report'}
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