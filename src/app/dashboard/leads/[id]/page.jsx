"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Building2,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
  Tag
} from "lucide-react";
import { getLeadById, deleteLead } from "@/app/action/server/leadsActions";

const Page = ({ params }) => {
  const router = useRouter();
  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLead();
  }, []);

  const fetchLead = async () => {
    try {
      const data = await getLeadById(params.id);
      setLead(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load lead'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${lead?.companyName}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        const deleteResult = await deleteLead(params.id);
        
        if (deleteResult.success) {
          Swal.fire({
            icon: 'success',
            title: 'Deleted!',
            text: 'Lead has been deleted successfully.',
            timer: 2000,
            showConfirmButton: false
          });
          router.push('/dashboard/leads');
        }
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete lead'
        });
      }
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hot': return 'bg-red-100 text-red-700';
      case 'Warm': return 'bg-yellow-100 text-yellow-700';
      case 'Cold': return 'bg-blue-100 text-blue-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F97316] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading lead details...</p>
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Lead not found</p>
          <Link
            href="/dashboard/leads"
            className="text-[#F97316] hover:underline"
          >
            Back to Leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard/leads"
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Lead Details</h1>
              <p className="text-sm text-gray-500">View lead information</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/dashboard/leads/${params.id}/edit`)}
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Edit2 className="w-4 h-4 mr-2 text-gray-600" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-800">Lead Information</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Company Name</label>
                  <p className="text-lg font-medium text-gray-900 flex items-center mt-1">
                    <Building2 className="w-5 h-5 text-gray-400 mr-2" />
                    {lead.companyName}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Contact Person</label>
                  <p className="text-lg font-medium text-gray-900 flex items-center mt-1">
                    <User className="w-5 h-5 text-gray-400 mr-2" />
                    {lead.firstName} {lead.lastName}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Email Address</label>
                  <p className="text-lg font-medium text-gray-900 flex items-center mt-1">
                    <Mail className="w-5 h-5 text-gray-400 mr-2" />
                    {lead.email}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Phone Number</label>
                  <p className="text-lg font-medium text-gray-900 flex items-center mt-1">
                    <Phone className="w-5 h-5 text-gray-400 mr-2" />
                    {lead.phone || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Lead Status</label>
                  <div className="mt-2">
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Lead Stage</label>
                  <p className="text-lg font-medium text-gray-900 flex items-center mt-1">
                    <Tag className="w-5 h-5 text-gray-400 mr-2" />
                    {lead.stage}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Lead Value</label>
                  <p className="text-lg font-medium text-gray-900 flex items-center mt-1">
                    <DollarSign className="w-5 h-5 text-gray-400 mr-2" />
                    ${Number(lead.value).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">Expected Close Date</label>
                  <p className="text-lg font-medium text-gray-900 flex items-center mt-1">
                    <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                    {lead.expectedCloseDate || 'Not set'}
                  </p>
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