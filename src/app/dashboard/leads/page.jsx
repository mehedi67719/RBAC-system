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
  Mail,
  Phone,
  Calendar,
  DollarSign,
  User,
  Building2
} from "lucide-react";
import { getLeads, deleteLead } from "@/app/action/server/leadsActions";
import { useSession } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  const currentUserPermissions = session?.user?.permissions || [];

  const hasPermission = (permission) => currentUserPermissions.includes(permission);

  useEffect(() => {
    if (hasPermission("leads.view")) fetchLeads();
  }, [session]);

  const fetchLeads = async () => {
    try {
      const data = await getLeads();
      setLeads(data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load leads",
      });
    }
  };

  const handleDelete = async (id, name) => {
    if (!hasPermission("leads.delete")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to delete leads",
      });
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete ${name}`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#EF4444",
      cancelButtonColor: "#6B7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteLead(id);
        if (deleteResult.success) {
          setLeads(leads.filter((lead) => lead.id !== id));
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "Lead has been deleted successfully.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else throw new Error(deleteResult.message);
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: error.message || "Failed to delete lead",
          confirmButtonColor: "#F97316",
        });
      }
    }
  };

  const handleEdit = (id) => {
    if (!hasPermission("leads.edit")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to edit leads",
      });
      return;
    }
    router.push(`/dashboard/leads/${id}/edit`);
  };

  const handleView = (id) => {
    if (!hasPermission("leads.view")) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission to view leads",
      });
      return;
    }
    router.push(`/dashboard/leads/${id}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Hot":
        return "bg-red-100 text-red-700 border-red-200";
      case "Warm":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Cold":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name?.toLowerCase().includes(search.toLowerCase()) ||
      lead.contact?.toLowerCase().includes(search.toLowerCase()) ||
      lead.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (!hasPermission("leads.view"))
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600">You don't have permission to view leads.</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Leads Management</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your sales leads
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchLeads}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          {hasPermission("leads.create") && (
            <Link
              href="/dashboard/leads/create"
              className="flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lead
            </Link>
          )}
        </div>
      </div>

      <div className="px-6 py-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search leads by name, contact or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
          />
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Company
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Contact
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Email
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Status
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Value
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Stage
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Date
                </th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-600 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50 group">
                  <td className="px-6 py-4 flex items-center">
                    <Building2 className="w-4 h-4 text-gray-400 mr-2" />
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    <User className="w-4 h-4 text-gray-400 mr-2" />
                    {lead.contact}
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    <Mail className="w-4 h-4 text-gray-400 mr-2" />
                    {lead.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex items-center">
                    <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                    {lead.value}
                  </td>
                  <td className="px-6 py-4">{lead.stage}</td>
                  <td className="px-6 py-4 flex items-center">
                    <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                    {lead.date}
                  </td>
                  <td className="px-6 py-4 flex items-center space-x-2">
                    {hasPermission("leads.view") && (
                      <button
                        onClick={() => handleView(lead.id)}
                        className="p-1 hover:bg-blue-50 rounded text-blue-600"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission("leads.edit") && (
                      <button
                        onClick={() => handleEdit(lead.id)}
                        className="p-1 hover:bg-green-50 rounded text-green-600"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                    {hasPermission("leads.delete") && (
                      <button
                        onClick={() => handleDelete(lead.id, lead.name)}
                        className="p-1 hover:bg-red-50 rounded text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLeads.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No leads found</p>
              {hasPermission("leads.create") && (
                <Link
                  href="/dashboard/leads/create"
                  className="inline-flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Your First Lead
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;