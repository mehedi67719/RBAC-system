"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { 
  Plus, 
  Search, 
  RefreshCw, 
  Edit2, 
  Trash2,
  Eye,
  MoreVertical,
  Filter,
  Download,
  Mail,
  Phone,
  Calendar
} from "lucide-react";
import { getLeads, deleteLead } from "@/app/action/server/leadsActions";

const Page = () => {
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedStage, setSelectedStage] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load leads'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${name}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteLead(id);
        
        if (deleteResult.success) {
          setLeads(leads.filter(lead => lead.id !== id));
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Lead has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          throw new Error(deleteResult.message);
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete lead',
          confirmButtonColor: '#F97316'
        });
      }
    }
  };

  const handleEdit = (id) => {
    router.push(`/dashboard/leads/${id}/edit`);
  };

  const handleView = (id) => {
    router.push(`/dashboard/leads/${id}`);
  };

  const handleStatusChange = async (id, newStatus) => {
    // You can implement status update here
    console.log('Change status:', id, newStatus);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hot': return 'bg-red-100 text-red-700 border-red-200';
      case 'Warm': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Cold': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStageColor = (stage) => {
    switch(stage) {
      case 'Initial Contact': return 'bg-purple-100 text-purple-700';
      case 'Discovery': return 'bg-indigo-100 text-indigo-700';
      case 'Proposal': return 'bg-blue-100 text-blue-700';
      case 'Negotiation': return 'bg-orange-100 text-orange-700';
      case 'Closing': return 'bg-green-100 text-green-700';
      case 'Won': return 'bg-emerald-100 text-emerald-700';
      case 'Lost': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = 
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.contact?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || lead.status === selectedStatus;
    const matchesStage = selectedStage === 'all' || lead.stage === selectedStage;
    
    return matchesSearch && matchesStatus && matchesStage;
  });

  const stats = {
    total: leads.length,
    hot: leads.filter(l => l.status === 'Hot').length,
    warm: leads.filter(l => l.status === 'Warm').length,
    cold: leads.filter(l => l.status === 'Cold').length,
    value: leads.reduce((sum, l) => {
      const val = parseFloat(l.value?.replace(/[$,]/g, '') || 0);
      return sum + val;
    }, 0)
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#F97316] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading leads...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
              <p className="text-sm text-gray-500 mt-1">Manage and track your sales leads</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2 text-gray-600" />
                Filters
              </button>
              <button
                onClick={fetchLeads}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4 text-gray-600" />
              </button>
              <Link
                href="/dashboard/leads/create"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-[#F97316] to-[#EA580C] text-white rounded-lg hover:from-[#EA580C] hover:to-[#F97316] transition-all duration-300 shadow-lg shadow-orange-500/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Lead
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-6 grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Leads</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Hot Leads</p>
          <p className="text-2xl font-bold text-red-600">{stats.hot}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Warm Leads</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.warm}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Cold Leads</p>
          <p className="text-2xl font-bold text-blue-600">{stats.cold}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Value</p>
          <p className="text-2xl font-bold text-green-600">
            ${stats.value.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="px-6 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, contact, email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Status
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="Hot">Hot</option>
                  <option value="Warm">Warm</option>
                  <option value="Cold">Cold</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filter by Stage
                </label>
                <select
                  value={selectedStage}
                  onChange={(e) => setSelectedStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                >
                  <option value="all">All Stages</option>
                  <option value="Initial Contact">Initial Contact</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closing">Closing</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Leads Table */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Company</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Contact</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Stage</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{lead.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{lead.contact}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-3 h-3 mr-1 text-gray-400" />
                        {lead.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{lead.value}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStageColor(lead.stage)}`}>
                        {lead.stage}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-3 h-3 mr-1 text-gray-400" />
                        {lead.date}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleView(lead.id)}
                          className="p-1.5 hover:bg-blue-50 rounded-lg transition-colors text-blue-600"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(lead.id)}
                          className="p-1.5 hover:bg-green-50 rounded-lg transition-colors text-green-600"
                          title="Edit Lead"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(lead.id, lead.name)}
                          className="p-1.5 hover:bg-red-50 rounded-lg transition-colors text-red-600"
                          title="Delete Lead"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-3">No leads found</div>
              <Link
                href="/dashboard/leads/create"
                className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Lead
              </Link>
            </div>
          )}

          {/* Table Footer */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredLeads.length} of {leads.length} leads
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50" disabled>
                  Previous
                </button>
                <button className="px-3 py-1 bg-[#F97316] text-white rounded text-sm hover:bg-[#EA580C]">
                  1
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-600 hover:bg-gray-100">
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;