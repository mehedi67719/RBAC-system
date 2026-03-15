"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import { useSession } from "next-auth/react";
import {
  UserPlus, Search, Shield, Users, Briefcase, Star, Trash2,
  ChevronDown, Key, Lock, Unlock, Globe, CheckCircle, XCircle,
  Mail, Phone, RefreshCw, AlertCircle, Ban
} from "lucide-react";
import { getUsers, updateUser, deleteUser } from "@/app/action/server/usersActions";

// Default permissions by role
const DEFAULT_PERMISSIONS = {
  admin: [
    "dashboard.view","users.view","users.create","users.edit","users.delete",
    "leads.view","leads.create","leads.edit","leads.delete",
    "tasks.view","tasks.create","tasks.edit","tasks.delete",
    "reports.view","reports.generate","audit.view","permissions.manage",
    "settings.manage","customer.view"
  ],
  manager: [
    "dashboard.view","team.view","users.view","users.create","users.edit",
    "leads.view","leads.create","leads.edit","tasks.view","tasks.create","tasks.edit",
    "reports.view","audit.view","customer.view"
  ],
  agent: [
    "dashboard.view","leads.view","leads.create","tasks.view","tasks.create","customer.view"
  ],
  customer: [
    "customer.dashboard","customer.tickets","customer.orders","customer.history","customer.profile"
  ]
};

// All permissions for checkbox UI
const ALL_PERMISSIONS = [
  { category: 'Dashboard', permissions: ['dashboard.view'] },
  { category: 'Users', permissions: ['users.view','users.create','users.edit','users.delete'] },
  { category: 'Permissions', permissions: ['permissions.manage'] },
  { category: 'Role', permissions: ['role.update'] },
  { category: 'Leads', permissions: ['leads.view','leads.create','leads.edit','leads.delete'] },
  { category: 'Tasks', permissions: ['tasks.view','tasks.create','tasks.edit','tasks.delete'] },
  { category: 'Reports', permissions: ['reports.view','reports.generate'] },
  { category: 'Settings', permissions: ['audit.view','settings.manage'] },
  { category: 'Customer', permissions: ['customer.view'] }
];

const Page = () => {
  const { data: session, status } = useSession();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [openPermissions, setOpenPermissions] = useState({});
  const [updatingUserId, setUpdatingUserId] = useState(null);

  // 🔹 Permission check function
  const hasPermission = (permission) => {
    if (!session?.user) return false;
    if (session.user.role === 'admin') return true; // Admin override
    return (session.user.permissions || []).includes(permission);
  };

  const canViewUsers = () => hasPermission('users.view');
  const canCreateUser = () => hasPermission('users.create');
  const canEditUser = () => hasPermission('users.edit');
  const canDeleteUser = () => hasPermission('users.delete');
  const canManagePermissions = () => hasPermission('permissions.manage');
  const canUpdateRole = () => hasPermission('role.update');

  // Fetch users
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getUsers();
      setUsers(data || []);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
      Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to load users', timer: 3000, showConfirmButton: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      if (canViewUsers()) fetchUsers();
      else setLoading(false);
    } else if (status === 'unauthenticated') {
      setLoading(false);
    }
  }, [status, session]);

  // Update user
  const handleUpdateUser = async (userId, updateData) => {
    if (!canEditUser()) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'You cannot edit users' });
      return;
    }
    try {
      setUpdatingUserId(userId);
      const result = await updateUser(userId, updateData);
      if (!result.success) throw new Error(result.message);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, ...result.data } : u));
      Swal.fire({ icon: 'success', title: 'Updated', text: 'User updated successfully', timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: err.message || 'Failed to update user' });
      fetchUsers();
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Change role
  const handleRoleChange = async (userId, newRole) => {
    if (!canUpdateRole() && !canEditUser()) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'Cannot change role' });
      return;
    }

    const targetUser = users.find(u => u._id === userId);
    if (!targetUser) return;

    const confirm = await Swal.fire({
      title: 'Change Role?',
      text: `Change role to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes'
    });

    if (confirm.isConfirmed) {
      const defaultPerms = DEFAULT_PERMISSIONS[newRole] || [];
      await handleUpdateUser(userId, { role: newRole, permissions: defaultPerms });
    }
  };

  // Change individual permission
  const handlePermissionChange = async (userId, permission, checked) => {
    if (!canManagePermissions() && !canEditUser()) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'Cannot modify permissions' });
      return;
    }

    const targetUser = users.find(u => u._id === userId);
    if (!targetUser) return;

    const updatedPerms = checked
      ? [...(targetUser.permissions || []), permission]
      : (targetUser.permissions || []).filter(p => p !== permission);

    await handleUpdateUser(userId, { permissions: updatedPerms });
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!canDeleteUser()) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'Cannot delete users' });
      return;
    }

    const targetUser = users.find(u => u._id === userId);
    if (!targetUser) return;

    const confirm = await Swal.fire({
      title: 'Delete User?',
      text: `Delete ${targetUser.firstName} ${targetUser.lastName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Delete'
    });

    if (confirm.isConfirmed) {
      try {
        setUpdatingUserId(userId);
        const deleteResult = await deleteUser(userId);
        if (!deleteResult.success) throw new Error(deleteResult.message);
        setUsers(prev => prev.filter(u => u._id !== userId));
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'User deleted', timer: 2000, showConfirmButton: false });
      } catch (err) {
        console.error(err);
        Swal.fire({ icon: 'error', title: 'Error', text: err.message });
      } finally {
        setUpdatingUserId(null);
      }
    }
  };

  // Change status
  const handleStatusChange = async (userId, currentStatus) => {
    if (!canEditUser()) {
      Swal.fire({ icon: 'error', title: 'Access Denied', text: 'Cannot change status' });
      return;
    }

    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    const confirm = await Swal.fire({
      title: `${newStatus} User?`,
      text: `Change status to ${newStatus}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#F97316',
      cancelButtonColor: '#6B7280'
    });

    if (confirm.isConfirmed) {
      await handleUpdateUser(userId, { status: newStatus });
    }
  };

  // Toggle permissions dropdown
  const togglePermissions = (userId) => setOpenPermissions(prev => ({ ...prev, [userId]: !prev[userId] }));

  // Filtered users
  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.firstName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      || (u.lastName?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      || (u.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
      || (u.role?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || u.role === roleFilter;
    const matchesStatus = !statusFilter || u.status === statusFilter;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Role badge UI helpers
  const getRoleBadgeColor = (role) => {
    switch(role?.toLowerCase()){
      case 'admin': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'manager': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'agent': return 'bg-green-50 text-green-700 border-green-200';
      case 'customer': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };
  const getRoleIcon = (role) => {
    switch(role?.toLowerCase()){
      case 'admin': return <Shield className="w-4 h-4 text-purple-600" />;
      case 'manager': return <Briefcase className="w-4 h-4 text-blue-600" />;
      case 'agent': return <Users className="w-4 h-4 text-green-600" />;
      case 'customer': return <Globe className="w-4 h-4 text-orange-600" />;
      default: return <Star className="w-4 h-4 text-gray-600" />;
    }
  };

  // Render loading / error / unauthorized
  if (status === 'loading') return <div className="p-4 flex justify-center items-center min-h-screen"><RefreshCw className="w-12 h-12 animate-spin text-[#F97316]" /></div>;
  if (status === 'unauthenticated') return (
    <div className="p-4 flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg">
        <Ban className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Not Authenticated</h2>
        <p className="text-gray-600 mb-6">Please login to access this page.</p>
        <Link href="/login" className="inline-block px-6 py-3 bg-[#F97316] text-white rounded-lg">Go to Login</Link>
      </div>
    </div>
  );
  if (!canViewUsers()) return (
    <div className="p-4 flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center bg-white p-8 rounded-xl shadow-lg">
        <Ban className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
        <p className="text-gray-600 mb-6">You don't have permission to view users.</p>
        <Link href="/dashboard" className="inline-block px-6 py-3 bg-[#F97316] text-white rounded-lg">Go to Dashboard</Link>
      </div>
    </div>
  );
  if (loading) return <div className="p-4 flex justify-center items-center min-h-screen"><RefreshCw className="w-12 h-12 animate-spin text-[#F97316]" /></div>;
  if (error) return (
    <div className="p-4">
      <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-red-900 mb-2">Error Loading Users</h3>
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={fetchUsers} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"><RefreshCw className="w-4 h-4 mr-2" /> Try Again</button>
      </div>
    </div>
  );

  // Main page render
  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header and stats */}
      <div className="bg-gradient-to-r from-[#F97316] to-[#EA580C] rounded-xl p-4 md:p-6 mb-6 text-white">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">User Management</h1>
            <p className="text-orange-100 text-sm md:text-base mt-1">Manage users, roles and permissions</p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchUsers} className="flex items-center px-3 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 text-sm">
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            {canCreateUser() && (
              <Link href="/dashboard/users/create" className="flex items-center px-4 py-2 bg-white text-[#F97316] rounded-lg hover:bg-orange-50 text-sm">
                <UserPlus className="w-4 h-4 mr-2" /> Add User
              </Link>
            )}
          </div>
        </div>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 md:gap-4 mt-4 md:mt-6">
          {['Total','Active','Admin','Manager','Agent','Customer'].map((label,i)=>{
            let count=0;
            switch(label){
              case 'Total': count=users.length; break;
              case 'Active': count=users.filter(u=>u.status==='Active').length; break;
              case 'Admin': count=users.filter(u=>u.role==='admin').length; break;
              case 'Manager': count=users.filter(u=>u.role==='manager').length; break;
              case 'Agent': count=users.filter(u=>u.role==='agent').length; break;
              case 'Customer': count=users.filter(u=>u.role==='customer').length; break;
            }
            return (
              <div key={i} className="bg-white/10 backdrop-blur-lg rounded-lg p-2 md:p-3 border border-white/20">
                <p className="text-orange-100 text-xs">{label}</p>
                <p className="text-lg md:text-2xl font-bold">{count}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Search & filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search users..." className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F97316] text-sm" value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] min-w-[120px]" value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
            <option value="customer">Customer</option>
          </select>
          <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#F97316] min-w-[120px]" value={statusFilter} onChange={(e)=>setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Role</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
                <th className="px-4 py-2 text-left font-medium text-gray-700">Permissions</th>
                <th className="px-4 py-2 text-center font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td className="px-4 py-2">{user.firstName} {user.lastName}</td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">
                    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg border ${getRoleBadgeColor(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="text-xs font-medium">{user.role}</span>
                      {canUpdateRole() && user.role !== 'admin' && (
                        <ChevronDown className="w-3 h-3 cursor-pointer" onClick={()=>{
                          const newRole = prompt("Enter new role (admin, manager, agent, customer):", user.role);
                          if(newRole && ['admin','manager','agent','customer'].includes(newRole)) handleRoleChange(user._id,newRole);
                        }} />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <button onClick={()=>handleStatusChange(user._id,user.status)} className={`px-2 py-1 text-xs rounded-full ${user.status==='Active'?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{user.status}</button>
                  </td>
                  <td className="px-4 py-2 relative">
                    <button onClick={()=>togglePermissions(user._id)} className="px-2 py-1 text-xs border rounded-lg">View</button>
                    {openPermissions[user._id] && (
                      <div className="absolute z-10 mt-1 bg-white border border-gray-200 shadow-lg p-3 rounded-lg w-64 max-h-64 overflow-auto">
                        {ALL_PERMISSIONS.map(cat=>(
                          <div key={cat.category} className="mb-2">
                            <p className="text-xs font-semibold text-gray-500 mb-1">{cat.category}</p>
                            <div className="flex flex-col gap-1">
                              {cat.permissions.map(p=>(
                                <label key={p} className="flex items-center gap-2 text-gray-700 text-xs">
                                  <input type="checkbox" checked={(user.permissions||[]).includes(p)} disabled={user.role==='admin' && !canManagePermissions()} onChange={(e)=>handlePermissionChange(user._id,p,e.target.checked)} />
                                  {p}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center space-x-2">
                    {canEditUser() && <button onClick={()=>alert('Edit user UI not implemented yet')} className="text-blue-600 hover:underline">Edit</button>}
                    {canDeleteUser() && <button onClick={()=>handleDeleteUser(user._id)} className="text-red-600 hover:underline">Delete</button>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Page;