"use client";

import React from "react";
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
} from "lucide-react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/users", icon: Users },
  { label: "Add User", href: "/dashboard/users/create", icon: UserPlus },
  { label: "Leads", href: "/dashboard/leads", icon: Target },
  { label: "Add Lead", href: "/dashboard/leads/create", icon: FilePlus },
  { label: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
  { label: "Add Task", href: "/dashboard/tasks/create", icon: PlusSquare },
  { label: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { label: "Audit Log", href: "/dashboard/audit-log", icon: ClipboardList },
  { label: "Permissions", href: "/dashboard/permissions", icon: Shield },
  { label: "Customer Portal", href: "/dashboard/customer", icon: Globe },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const Sidebar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  console.log(session)

  const isActive = (href) => pathname.startsWith(href);

  return (
    <div className="h-screen sticky top-0 w-64 shrink-0 bg-white border-r border-slate-200 overflow-y-auto font-sans flex flex-col">
      <div className="px-4 py-6 border-b border-slate-200">
        <div className="text-base font-semibold text-slate-900">John&apos;s workspace</div>
        <div className="text-xs text-slate-400 mt-1">#WID12446875</div>
      </div>

      <div className="py-4 flex-1">
        {status === "loading" ? (
          <div className="space-y-1 px-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-9 bg-slate-100 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          menuItems.map((item, index) => {
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
                <Icon
                  className={`w-4 h-4 mr-3 ${
                    isActive(item.href)
                      ? "text-[#F97316]"
                      : "text-slate-400 group-hover:text-slate-600"
                  }`}
                />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })
        )}
      </div>

      <div className="px-4 py-4 border-t border-slate-200">
        <Link
          href="/logout"
          className="flex items-center px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 group transition-all rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-3 text-slate-400 group-hover:text-slate-600" />
          <span className="font-medium">Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;