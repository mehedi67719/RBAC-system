"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  ArrowLeft,
  Save,
  User,
  Mail,
  Phone,
  Lock,
  Shield,
  AlertCircle,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { createUser } from "@/app/action/server/usersActions";

const Page = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "agent",
    status: "Active",
    emailVerified: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.firstName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'First name is required',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    if (!formData.lastName.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Last name is required',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    if (!formData.email.trim()) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Email is required',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid email address',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    if (!formData.password) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password is required',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Password must be at least 6 characters long',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Passwords do not match',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    if (formData.phone && !/^[0-9+\-\s()]+$/.test(formData.phone)) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please enter a valid phone number',
        confirmButtonColor: '#F97316'
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Create FormData object
      const formDataObj = new FormData();
      formDataObj.append("name", `${formData.firstName} ${formData.lastName}`.trim());
      formDataObj.append("firstName", formData.firstName);
      formDataObj.append("lastName", formData.lastName);
      formDataObj.append("email", formData.email);
      formDataObj.append("phone", formData.phone);
      formDataObj.append("username", formData.username || formData.email.split('@')[0]);
      formDataObj.append("password", formData.password);
      formDataObj.append("role", formData.role);
      formDataObj.append("status", formData.status);
      formDataObj.append("emailVerified", formData.emailVerified.toString());

      const result = await createUser(formDataObj, {
        id: session?.user?.id,
        email: session?.user?.email,
      });

      console.log("Create user result:", result);

      if (result.success) {
        await Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: result.message || 'User created successfully',
          timer: 2000,
          showConfirmButton: false
        });
        
        // Redirect to users list
        router.push('/dashboard/users');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: result.message || 'Failed to create user',
          confirmButtonColor: '#F97316'
        });
      }
    } catch (error) {
      console.error("Error creating user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'An unexpected error occurred',
        confirmButtonColor: '#F97316'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/dashboard/users"
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Add New User</h1>
            <p className="text-sm text-gray-500 mt-1">Create a new user account with specific permissions</p>
          </div>
        </div>
        <button
          type="submit"
          form="create-user-form"
          disabled={loading}
          className="flex items-center px-4 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save User'}
        </button>
      </div>

      {/* Main Form */}
      <form
        id="create-user-form"
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left Column - Basic Information */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="user@example.com"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Account Security Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Security</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-2 text-sm text-gray-500">
                <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <p>Password must be at least 6 characters long</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Role & Status */}
        <div className="space-y-6">
          {/* Role Selection Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">User Role</h2>
            <div className="space-y-3">
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="role" 
                  value="admin" 
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#F97316]" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">Full system access with all permissions</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="role" 
                  value="manager" 
                  checked={formData.role === 'manager'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#F97316]" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Manager</p>
                  <p className="text-xs text-gray-500">Can manage team and assign permissions</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="role" 
                  value="agent" 
                  checked={formData.role === 'agent'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#F97316]" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Agent</p>
                  <p className="text-xs text-gray-500">Can work on leads and tasks</p>
                </div>
              </label>
              <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input 
                  type="radio" 
                  name="role" 
                  value="customer" 
                  checked={formData.role === 'customer'}
                  onChange={handleChange}
                  className="w-4 h-4 text-[#F97316]" 
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Customer</p>
                  <p className="text-xs text-gray-500">Limited access to own portal only</p>
                </div>
              </label>
            </div>
          </div>

          {/* Account Status Card */}
          <div className="bg-white rounded-lg border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select 
                  name="status" 
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Verification
                </label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    name="emailVerified" 
                    checked={formData.emailVerified}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#F97316] rounded" 
                  />
                  <span className="text-sm text-gray-600">Mark as verified</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Tips Card */}
          <div className="bg-blue-50 rounded-lg border border-blue-100 p-4">
            <div className="flex items-start space-x-2">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-blue-900">Permission Tips</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Users will only see pages and features based on their assigned role. You can customize individual permissions after creation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Page;