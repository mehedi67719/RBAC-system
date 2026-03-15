// components/Sidebar.js
"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  Target,
  FilePlus,
  CheckSquare,
  PlusSquare,
  BarChart3,
  ClipboardList,
  Shield,
  Globe,
  Settings,
  LogOut,
  UserCog,
  UserCircle,
  Users2,
  Briefcase,
} from "lucide-react";

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const menuItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "dashboard.view" },
    { label: "Users", href: "/dashboard/users", icon: Users, permission: "users.view" },
    { label: "Add User", href: "/dashboard/users/create", icon: UserPlus, permission: "users.create" },
    { label: "My Team", href: "/dashboard/team", icon: Users2, permission: "team.view" },

    { label: "Leads", href: "/dashboard/leads", icon: Target, permission: "leads.view" },
    { label: "Add Lead", href: "/dashboard/leads/create", icon: FilePlus, permission: "leads.create" },
    { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare, permission: "tasks.view" },
    { label: "Add Task", href: "/dashboard/tasks/create", icon: PlusSquare, permission: "tasks.create" },
    { label: "Reports", href: "/dashboard/reports", icon: BarChart3, permission: "reports.view" },
    { label: "Audit Log", href: "/dashboard/audit-log", icon: ClipboardList, permission: "audit.view" },
   
  ];

  const customerMenuItems = [
    { label: "Dashboard", href: "/customer", icon: LayoutDashboard, permission: "customer.dashboard" },
    { label: "My Tickets", href: "/customer/tickets", icon: ClipboardList, permission: "customer.tickets" },
    { label: "My Orders", href: "/customer/orders", icon: Briefcase, permission: "customer.orders" },
    { label: "History", href: "/customer/history", icon: BarChart3, permission: "customer.history" },
    { label: "Profile", href: "/customer/profile", icon: UserCircle, permission: "customer.profile" },
  ];

  const filteredMenuItems = useMemo(() => {
    if (!session?.user) return [];
    const userRole = session.user.role;
    const userPermissions = session.user.permissions || [];
    if (userRole === "admin") return menuItems;
    if (userRole === "customer") {
      return customerMenuItems.filter(item => userPermissions.includes(item.permission));
    }
    return menuItems.filter(item => item.permission ? userPermissions.includes(item.permission) : true);
  }, [session]);

  const isActive = (href) => pathname.startsWith(href);

  const getUserDisplay = () => {
    if (!session?.user) return { name: "Guest", workspace: "" };
    const user = session.user;
    const name = user.name || (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : null) || user.email || "User";
    const roleDisplay = (user.role || "User").charAt(0).toUpperCase() + (user.role || "User").slice(1);
    return { name, workspace: roleDisplay + " Workspace" };
  };

  const { name, workspace } = getUserDisplay();

  if (status === "loading") return <SidebarSkeleton />;

  if (filteredMenuItems.length === 0) {
    return (
      <div className="h-screen sticky top-0 w-64 shrink-0 bg-white border-r border-slate-200 p-4">
        <div className="text-center py-8">
          <p className="text-sm text-slate-400">No menu items available for your role</p>
          <p className="text-xs text-slate-300 mt-2">Role: {session?.user?.role || "Unknown"}</p>
        </div>
        <SidebarFooter />
      </div>
    );
  }

  return (
    <div className="h-screen sticky top-0 w-64 shrink-0 bg-white border-r border-slate-200 overflow-y-auto font-sans flex flex-col">
      <div className="px-4 py-6 border-b border-slate-200">
        <div className="text-base font-semibold text-slate-900">{name}</div>
        <div className="text-xs text-slate-400 mt-1">{workspace}</div>
        <div className="mt-2">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-50 text-[#F97316] border border-orange-200">
            {session?.user?.role || "User"}
          </span>
        </div>
      </div>
      <div className="py-4 flex-1">
        {filteredMenuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-4 py-2.5 text-sm group transition-all ${
                isActive(item.href)
                  ? "text-[#F97316] bg-[#FFF7ED] border-r-2 border-[#F97316]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <Icon className={`w-4 h-4 mr-3 ${isActive(item.href) ? "text-[#F97316]" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
      <SidebarFooter />
    </div>
  );
};

const SidebarSkeleton = () => (
  <div className="h-screen sticky top-0 w-64 shrink-0 bg-white border-r border-slate-200 p-4">
    <div className="space-y-4">
      <div className="h-10 bg-slate-100 rounded-lg animate-pulse" />
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-9 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  </div>
);

const SidebarFooter = () => (
  <div className="px-4 py-4 border-t border-slate-200">
    <Link
      href="/api/auth/signout"
      className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 group transition-all rounded-lg"
    >
      <LogOut className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
      <span className="font-medium">Logout</span>
    </Link>
  </div>
);

export default Sidebar;