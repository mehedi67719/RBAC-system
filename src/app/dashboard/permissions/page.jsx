"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import {
  Search,
  Filter,
  Shield,
  User,
  Users,
  Briefcase,
  Save,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Check,
  X,
} from "lucide-react";

const Page = () => {
  const [expandedRoles, setExpandedRoles] = useState(["admin", "manager"]);
  const [selectedUser, setSelectedUser] = useState("all");
  const { data: session } = useSession();
  const currentRole = session?.user?.role || "customer";
  const currentPermissions = session?.user?.permissions || [];

  const permissions = [
    { id: 'dashboard', name: 'Dashboard', atoms: [
      { id: 'dashboard.view', name: 'View Dashboard', description: 'Access to main dashboard' }
    ]},
    { id: 'users', name: 'User Management', atoms: [
      { id: 'users.view', name: 'View Users', description: 'See list of users' },
      { id: 'users.create', name: 'Create Users', description: 'Add new users to system' },
      { id: 'users.edit', name: 'Edit Users', description: 'Modify user details' },
      { id: 'users.delete', name: 'Delete Users', description: 'Remove users from system' }
    ]},
    { id: 'leads', name: 'Leads', atoms: [
      { id: 'leads.view', name: 'View Leads', description: 'Access to leads section' },
      { id: 'leads.create', name: 'Create Leads', description: 'Add new leads' },
      { id: 'leads.edit', name: 'Edit Leads', description: 'Modify lead information' },
      { id: 'leads.delete', name: 'Delete Leads', description: 'Remove leads' }
    ]},
    { id: 'tasks', name: 'Tasks', atoms: [
      { id: 'tasks.view', name: 'View Tasks', description: 'Access to tasks section' },
      { id: 'tasks.create', name: 'Create Tasks', description: 'Add new tasks' },
      { id: 'tasks.edit', name: 'Edit Tasks', description: 'Modify task details' },
      { id: 'tasks.delete', name: 'Delete Tasks', description: 'Remove tasks' }
    ]},
    { id: 'reports', name: 'Reports', atoms: [
      { id: 'reports.view', name: 'View Reports', description: 'Access to reports section' },
      { id: 'reports.generate', name: 'Generate Reports', description: 'Create new reports' },
      { id: 'reports.export', name: 'Export Reports', description: 'Download reports' }
    ]},
    { id: 'audit', name: 'Audit', atoms: [
      { id: 'audit.view', name: 'View Audit Log', description: 'Access to audit logs' }
    ]},
    { id: 'permissions', name: 'Permissions', atoms: [
      { id: 'permissions.manage', name: 'Manage Permissions', description: 'Modify user permissions' }
    ]},
    { id: 'customer', name: 'Customer Portal', atoms: [
      { id: 'customer.view', name: 'View Customer Portal', description: 'Access to customer portal' }
    ]},
    { id: 'settings', name: 'Settings', atoms: [
      { id: 'settings.manage', name: 'Manage Settings', description: 'Modify system settings' }
    ]}
  ];

  const roles = [
    { id: "admin", name: "Admin", color: "purple", users: 3 },
    { id: "manager", name: "Manager", color: "blue", users: 8 },
    { id: "agent", name: "Agent", color: "green", users: 24 },
    { id: "customer", name: "Customer", color: "orange", users: 156 },
  ];

  const users = [
    { id: 1, name: "John Doe", role: "Admin", avatar: "JD" },
    { id: 2, name: "Sarah Smith", role: "Manager", avatar: "SS" },
    { id: 3, name: "Mike Johnson", role: "Agent", avatar: "MJ" },
    { id: 4, name: "Emily Brown", role: "Agent", avatar: "EB" },
  ];

  const toggleRole = (roleId) => {
    if (expandedRoles.includes(roleId)) {
      setExpandedRoles(expandedRoles.filter((id) => id !== roleId));
    } else {
      setExpandedRoles([...expandedRoles, roleId]);
    }
  };

  const getRoleColor = (color) => {
    const colors = {
      purple: "bg-purple-50 text-purple-700 border-purple-200",
      blue: "bg-blue-50 text-blue-700 border-blue-200",
      green: "bg-green-50 text-green-700 border-green-200",
      orange: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return colors[color] || colors.blue;
  };

  const canEditRole = (roleId) => {
    if (currentRole === "admin") return true;
    if (currentRole === "manager") {
      return roleId === "agent" || roleId === "customer";
    }
    return false;
  };

  const canGrantPermission = (atomId, targetRoleId) => {
    if (!canEditRole(targetRoleId)) return false;
    if (currentRole === "admin") return true;
    return currentPermissions.includes(atomId);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-xs font-semibold tracking-[0.25em] text-[#F97316] uppercase">
            Permissions
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-900">
            Access control
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Assign permissions using grant ceiling rules based on your own
            access.
          </p>
        </div>
        <button className="flex items-center px-4 py-2 rounded-2xl bg-[#F97316] text-white text-sm font-semibold shadow-sm shadow-[#FDBA74]/40 hover:bg-[#EA580C] transition-colors">
          <Save className="w-4 h-4 mr-2" />
          Save changes
        </button>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
        <div className="flex items-start space-x-2">
          <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900">
              Grant Ceiling Enforcement
            </h3>
            <p className="text-xs text-blue-700 mt-1">
              You can only assign permissions you hold yourself. Managers can
              grant within their own scope to Agents and Customers.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
          <button 
            onClick={() => setSelectedUser('all')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              selectedUser === 'all' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            All Roles
          </button>
          <button 
            onClick={() => setSelectedUser('users')}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              selectedUser === 'users' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Individual Users
          </button>
        </div>
      </div>

      {selectedUser === 'all' ? (
        /* Role-based View */
        <div className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div 
                onClick={() => toggleRole(role.id)}
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${getRoleColor(role.color)}`}>
                    {role.id === 'admin' && <Shield className="w-5 h-5" />}
                    {role.id === 'manager' && <Briefcase className="w-5 h-5" />}
                    {role.id === 'agent' && <Users className="w-5 h-5" />}
                    {role.id === 'customer' && <User className="w-5 h-5" />}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-gray-900">{role.name}</h3>
                    <p className="text-xs text-gray-500">{role.users} users with this role</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-xs text-gray-400">Click to {expandedRoles.includes(role.id) ? 'collapse' : 'expand'}</span>
                  {expandedRoles.includes(role.id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>

              {expandedRoles.includes(role.id) && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                    {permissions.map((category) => (
                      <div key={category.id} className="bg-white rounded-lg border border-gray-200 p-4">
                        <h4 className="text-sm font-semibold text-gray-800 mb-3">{category.name}</h4>
                        <div className="space-y-2">
                          {category.atoms.map((atom) => (
                            <label key={atom.id} className="flex items-start space-x-2 cursor-pointer group">
                              <input 
                                type="checkbox" 
                                className="mt-0.5 w-4 h-4 text-[#F97316] rounded border-gray-300 focus:ring-[#F97316]"
                                defaultChecked={role.id === 'admin' || (role.id === 'manager' && ['dashboard.view', 'users.view', 'leads.view', 'tasks.view'].includes(atom.id))}
                                disabled={!canGrantPermission(atom.id, role.id)}
                              />
                              <div className="flex-1">
                                <p className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{atom.name}</p>
                                <p className="text-xs text-slate-400">{atom.description}</p>
                              </div>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* Individual User View */
        <div>
          {/* User Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="flex items-center px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2 text-gray-500" />
                Filter by Role
              </button>
            </div>
          </div>

          {/* Users List */}
          <div className="space-y-3">
            {users.map((user) => (
              <div key={user.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{user.name}</h3>
                      <p className="text-xs text-gray-500">{user.role}</p>
                    </div>
                  </div>
                  <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Edit Permissions
                  </button>
                </div>

                {/* User Permission Summary */}
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Dashboard
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Leads
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
                    <Check className="w-3 h-3 mr-1" />
                    Tasks
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                    <X className="w-3 h-3 mr-1" />
                    Reports
                  </span>
                  <span className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                    <X className="w-3 h-3 mr-1" />
                    Settings
                  </span>
                  <span className="text-xs text-gray-400">+3 more</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grant Ceiling Info */}
      <div className="mt-6 bg-yellow-50 border border-yellow-100 rounded-lg p-4">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-yellow-900">Permission Inheritance</h3>
            <p className="text-xs text-yellow-700 mt-1">
              Users inherit permissions from their role. Individual overrides are possible but cannot exceed the grant ceiling of the assigning user.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;