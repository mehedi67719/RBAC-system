"use client";

import React, { useState, useEffect } from "react";
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
import { getLeadById, updateLead } from "@/app/action/server/leadsActions";

const Page = ({ params }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    status: 'Cold',
    stage: 'Initial Contact',
    value: '',
    expectedCloseDate: ''
  });

  useEffect(() => {
    fetchLead();
  }, []);

  const fetchLead = async () => {
    try {
      const data = await getLeadById(params.id);
      if (data) {
        setFormData({
          companyName: data.companyName || '',
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          email: data.email || '',
          phone: data.phone || '',
          status: data.status || 'Cold',
          stage: data.stage || 'Initial Contact',
          value: data.value || '',
          expectedCloseDate: data.expectedCloseDate || ''
        });
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load lead'
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formDataObj = new FormData();
    Object.keys(formData).forEach(key => {
      formDataObj.append(key, formData[key]);
    });

    try {
      const result = await updateLead(params.id, formDataObj, {
        id: session?.user?.id,
        email: session?.user?.email,
      });

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Lead updated successfully',
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
    <div className="min-h-screen bg-gray-50 w-full">
   
      <div className="bg-white border-b border-gray-200 w-full sticky top-0 z-10">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard/leads"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Edit Lead</h1>
                <p className="text-sm text-gray-500">Update lead information</p>
              </div>
            </div>
            <button
              type="submit"
              form="edit-lead-form"
              disabled={loading}
              className="flex items-center px-6 py-2.5 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50 shadow-lg shadow-orange-500/20"
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Updating...' : 'Update Lead'}
            </button>
          </div>
        </div>
      </div>

    
      <div className="w-full p-6">
        <form id="edit-lead-form" onSubmit={handleSubmit} className="w-full">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm w-full overflow-hidden">
              <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-transparent border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-800">Lead Information</h2>
            </div>

          
            <div className="p-6 w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
             
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                      placeholder="ABC Corp"
                    />
                  </div>
                </div>

                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      type="text"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                      placeholder="Mehedi"
                    />
                  </div>
                </div>

            
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    type="text"
                    required
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                    placeholder="Hassan"
                  />
                </div>

           
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="email"
                      required
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                      placeholder="mehedi@abc.com"
                    />
                  </div>
                </div>

             
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      type="tel"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

         
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                  >
                    <option value="Hot" className="text-red-600">Hot 🔥</option>
                    <option value="Warm" className="text-yellow-600">Warm ⭐</option>
                    <option value="Cold" className="text-blue-600">Cold ❄️</option>
                  </select>
                </div>

           
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Lead Value ($)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="value"
                      value={formData.value}
                      onChange={handleChange}
                      type="number"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                      placeholder="15000"
                    />
                  </div>
                </div>

           
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Stage
                  </label>
                  <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                  >
                    <option value="Initial Contact">Initial Contact</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closing">Closing</option>
                  </select>
                </div>

                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Expected Close Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="expectedCloseDate"
                      value={formData.expectedCloseDate}
                      onChange={handleChange}
                      type="date"
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all bg-white hover:border-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

       
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <Link
                  href="/dashboard/leads"
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  form="edit-lead-form"
                  disabled={loading}
                  className="px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Updating...' : 'Save Changes'}
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