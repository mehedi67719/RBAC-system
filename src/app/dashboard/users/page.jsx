"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import {
  UserPlus,
  Search,
  Shield,
  Users,
  Briefcase,
  Star,
  Trash2,
  ChevronDown,
  Key,
  Lock,
  Unlock,
  Globe,
  CheckCircle,
  XCircle,
  Mail,
  Phone,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { getUsers, updateUser, deleteUser } from "@/app/action/server/usersActions";

const Page = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openPermissions, setOpenPermissions] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      console.log("Fetched users:", data);
      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load users");
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load users',
        timer: 3000,
        showConfirmButton: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId, updateData) => {
    try {
      setUpdatingUserId(userId);
      console.log("Updating user:", userId, updateData);
      
      const result = await updateUser(userId, updateData);
      console.log("Update result:", result);

      if (!result.success) {
        throw new Error(result.message);
      }

      // Update local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, ...result.data } : user
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'User updated successfully',
        timer: 2000,
        showConfirmButton: false
      });

    } catch (error) {
      console.error('Error updating user:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to update user',
        confirmButtonColor: '#F97316'
      });
      
      // Revert by refetching
      fetchUsers();
    } finally {
      setUpdatingUserId(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    const userToUpdate = users.find(user => user._id === userId);
    if (!userToUpdate) return;

    const result = await Swal.fire({
      title: 'Change Role?',
      text: `Are you sure you want to change role to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, change it!'
    });

    if (result.isConfirmed) {
      // Optimistic update
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      await handleUpdateUser(userId, { role: newRole });
    }
  };

  const handlePermissionChange = async (userId, permission, checked) => {
    const userToUpdate = users.find(user => user._id === userId);
    if (!userToUpdate) return;

    const updatedPermissions = checked 
      ? [...(userToUpdate.permissions || []), permission]
      : (userToUpdate.permissions || []).filter(p => p !== permission);

    // Optimistic update
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user._id === userId ? { ...user, permissions: updatedPermissions } : user
      )
    );

    await handleUpdateUser(userId, { permissions: updatedPermissions });
  };

  const handleDeleteUser = async (userId, userName) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete ${userName}. This action cannot be undone!`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      try {
        setUpdatingUserId(userId);
        
        const deleteResult = await deleteUser(userId);
        console.log("Delete result:", deleteResult);

        if (!deleteResult.success) {
          throw new Error(deleteResult.message);
        }

        // Remove from local state
        setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));

        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted successfully.',
          timer: 2000,
          showConfirmButton: false
        });

      } catch (error) {
        console.error('Error deleting user:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'Failed to delete user',
          confirmButtonColor: '#F97316'
        });
      } finally {
        setUpdatingUserId(null);
      }
    }
  };

  const handleStatusChange = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const action = newStatus === 'Active' ? 'activate' : 'deactivate';

    const result = await Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} User?`,
      text: `Are you sure you want to ${action} this user?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Yes, ${action} it!`
    });

    if (result.isConfirmed) {
      // Optimistic update
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, status: newStatus } : user
        )
      );

      await handleUpdateUser(userId, { status: newStatus });
    }
  };

  // ... rest of your component code (stats, getRoleIcon, etc.) ...
  
  const totalUsers = users?.length || 0;
  const activeUsers = users?.filter(user => user.status === "Active").length || 0;
  const admins = users?.filter(user => user.role === "admin").length || 0;
  const managers = users?.filter(user => user.role === "manager").length || 0;
  const agents = users?.filter(user => user.role === "agent").length || 0;
  const customers = users?.filter(user => user.role === "customer").length || 0;

  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'manager': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'agent': return <Users className="w-4 h-4 text-green-600" />;
      case 'customer': return <Globe className="w-4 h-4 text-orange-600" />;
      default: return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role?.toLowerCase()) {
      case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'manager': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'agent': return 'bg-green-50 text-green-700 border-green-200';
      case 'customer': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const allPermissions = [
    { category: 'Dashboard', permissions: ['dashboard.view'] },
    { category: 'Users', permissions: ['users.view', 'users.create', 'users.edit', 'users.delete'] },
    { category: 'Leads', permissions: ['leads.view', 'leads.create', 'leads.edit', 'leads.delete'] },
    { category: 'Tasks', permissions: ['tasks.view', 'tasks.create', 'tasks.edit', 'tasks.delete'] },
    { category: 'Reports', permissions: ['reports.view', 'reports.generate'] },
    { category: 'Settings', permissions: ['audit.view', 'permissions.manage', 'settings.manage'] },
    { category: 'Customer', permissions: ['customer.view'] }
  ];

  const togglePermissions = (userId) => {
    setOpenPermissions(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      (user.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (user.username?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-[#F97316] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 rounded-lg border border-red-200 p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Users</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchUsers}
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-xl p-4 md:p-6 mb-6 md:mb-8 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
            <p className="text-orange-100 text-sm md:text-base mt-1">Manage users, roles and permissions</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchUsers}
              className="flex items-center px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors text-sm"
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <Link
              href="/dashboard/users/create"
              className="flex items-center px-4 py-2 bg-white text-[#F97316] rounded-lg hover:bg-orange-50 transition-colors text-sm"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Add User
            </Link>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 mt-4 md:mt-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-3 border border-white/20">
            <p className="text-orange-100 text-xs">Total</p>
            <p className="text-lg md:text-2xl font-bold">{totalUsers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-3 border border-white/20">
            <p className="text-orange-100 text-xs">Active</p>
            <p className="text-lg md:text-2xl font-bold">{activeUsers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-3 border border-white/20">
            <p className="text-orange-100 text-xs">Admin</p>
            <p className="text-lg md:text-2xl font-bold">{admins}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-3 border border-white/20">
            <p className="text-orange-100 text-xs">Manager</p>
            <p className="text-lg md:text-2xl font-bold">{managers}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-3 border border-white/20">
            <p className="text-orange-100 text-xs">Agent</p>
            <p className="text-lg md:text-2xl font-bold">{agents}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-3 border border-white/20">
            <p className="text-orange-100 text-xs">Customer</p>
            <p className="text-lg md:text-2xl font-bold">{customers}</p>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] min-w-[120px]"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>
          <select 
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] min-w-[120px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">User</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Role</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Permissions</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Verification</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Contact</th>
                <th className="text-left text-xs font-semibold text-gray-600 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className={`hover:bg-gray-50 transition-colors ${updatingUserId === user._id ? 'opacity-50 pointer-events-none' : ''}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-[#F97316] to-[#EA580C] flex items-center justify-center text-white font-semibold text-sm md:text-base">
                        {user.firstName?.charAt(0) || 'U'}{user.lastName?.charAt(0) || ''}
                      </div>
                      <div className="ml-2 md:ml-3">
                        <p className="text-xs md:text-sm font-medium text-gray-900">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-xs text-gray-500">@{user.username || 'username'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <select 
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        className={`text-xs px-2 py-1 rounded-full border ${getRoleBadgeColor(user.role)} focus:outline-none focus:ring-2 focus:ring-[#F97316] cursor-pointer`}
                        value={user.role}
                        disabled={updatingUserId === user._id}
                      >
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                        <option value="agent">Agent</option>
                        <option value="customer">Customer</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleStatusChange(user._id, user.status)}
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                        user.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100' : 
                        'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                      }`}
                      disabled={updatingUserId === user._id}
                    >
                      {user.status === 'Active' ? <Unlock className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {user.status || 'Unknown'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative">
                      <button 
                        onClick={() => togglePermissions(user._id)}
                        className="flex items-center gap-1 text-xs text-gray-600 hover:text-[#F97316]"
                        disabled={updatingUserId === user._id}
                      >
                        <Key className="w-3 h-3" />
                        <span>{user.permissions?.length || 0} perms</span>
                        <ChevronDown className="w-3 h-3" />
                      </button>
                      
                      {openPermissions[user._id] && (
                        <div className="absolute left-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl p-3 z-50">
                          <div className="flex justify-between items-center mb-2">
                            <p className="text-xs font-semibold text-gray-900">Permissions</p>
                            <span className="text-xs bg-[#F97316] text-white px-2 py-0.5 rounded-full capitalize">{user.role}</span>
                          </div>
                          
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {allPermissions.map((category, idx) => (
                              <div key={idx} className="border-b border-gray-100 pb-2 last:border-0">
                                <p className="text-xs font-semibold text-gray-700 mb-1">{category.category}</p>
                                <div className="space-y-1">
                                  {category.permissions.map((perm, permIdx) => (
                                    <label key={permIdx} className="flex items-center justify-between text-xs cursor-pointer">
                                      <span className="text-gray-600">{perm}</span>
                                      <input 
                                        type="checkbox" 
                                        className="w-3 h-3 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                                        checked={user.permissions?.includes(perm)}
                                        onChange={(e) => handlePermissionChange(user._id, perm, e.target.checked)}
                                        disabled={updatingUserId === user._id}
                                      />
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
                            <button 
                              onClick={() => togglePermissions(user._id)}
                              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      {user.emailVerified ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <XCircle className="w-3 h-3 text-gray-400" />
                      )}
                      <span className="text-xs text-gray-600">
                        {user.emailVerified ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center text-xs text-gray-600">
                        <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span className="truncate max-w-[120px]">{user.email || 'N/A'}</span>
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
                        <span>{user.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleDeleteUser(user._id, `${user.firstName} ${user.lastName}`)}
                      className="p-1 hover:bg-red-50 rounded transition-colors text-red-500"
                      title="Delete User"
                      disabled={updatingUserId === user._id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No users found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-3 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </p>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
              Previous
            </button>
            <button className="px-3 py-1 bg-[#F97316] text-white rounded text-xs hover:bg-[#EA580C]">1</button>
            <button className="px-3 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;