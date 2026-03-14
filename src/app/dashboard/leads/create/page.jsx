"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Save,
  Building2,
  User,
  Mail,
  Phone,
  DollarSign,
  Calendar,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { createLead } from "@/app/action/server/leadsActions";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);

    try {
      const result = await createLead(formData, {
        id: session?.user?.id,
        email: session?.user?.email,
      });

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Lead created successfully',
          timer: 2000,
          showConfirmButton: false
        });
        router.push('/dashboard/leads');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message,
          confirmButtonColor: '#F97316'
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Something went wrong',
        confirmButtonColor: '#F97316'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - Full Width */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 w-full">
        <div className="px-6 py-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/leads"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Create New Lead</h1>
                <p className="text-sm text-gray-500">Add a new lead to your pipeline</p>
              </div>
            </div>
            <button
              type="submit"
              form="lead-form"
              disabled={loading}
              className="flex items-center px-6 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Creating...' : 'Create Lead'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <div className="p-6 w-full">
        <form id="lead-form" onSubmit={handleSubmit} className="w-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full">
            {/* Form Header */}
            <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 rounded-t-xl">
              <h2 className="text-lg font-semibold text-gray-800">Lead Information</h2>
            </div>

            {/* Form Body */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="companyName"
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      placeholder="ABC Corp"
                    />
                  </div>
                </div>

                {/* First Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="firstName"
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      placeholder="Mehedi"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                    placeholder="Hassan"
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="email"
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      placeholder="mehedi@abc.com"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="phone"
                      type="tel"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                  >
                    <option value="Hot">Hot</option>
                    <option value="Warm">Warm</option>
                    <option value="Cold">Cold</option>
                  </select>
                </div>

                {/* Value */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Lead Value ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="value"
                      type="number"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                      placeholder="15000"
                    />
                  </div>
                </div>

                {/* Stage */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stage
                  </label>
                  <select
                    name="stage"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                  >
                    <option value="Initial Contact">Initial Contact</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closing">Closing</option>
                  </select>
                </div>

                {/* Expected Close Date */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expected Close Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="expectedCloseDate"
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Preview of your data */}
              <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-sm font-medium text-orange-800 mb-3">Sample Data Format:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-orange-600">Company:</span>
                    <span className="ml-1 text-gray-700">ABC Corp</span>
                  </div>
                  <div>
                    <span className="text-orange-600">Contact:</span>
                    <span className="ml-1 text-gray-700">Mehedi Hassan</span>
                  </div>
                  <div>
                    <span className="text-orange-600">Email:</span>
                    <span className="ml-1 text-gray-700">mehedi@abc.com</span>
                  </div>
                  <div>
                    <span className="text-orange-600">Status:</span>
                    <span className="ml-1 text-red-600">Hot</span>
                  </div>
                  <div>
                    <span className="text-orange-600">Value:</span>
                    <span className="ml-1 text-gray-700">$15,000</span>
                  </div>
                  <div>
                    <span className="text-orange-600">Stage:</span>
                    <span className="ml-1 text-gray-700">Initial Contact</span>
                  </div>
                  <div>
                    <span className="text-orange-600">Date:</span>
                    <span className="ml-1 text-gray-700">2026-03-10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Page;