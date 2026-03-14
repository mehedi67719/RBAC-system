"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

const Sidebar = () => {
  const pathname = usePathname();

  const menuConfig = [
    {
      items: [
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
      ],
    },
  ];

  // ✅ Active highlight including subpages
  const isActive = (href) => pathname.startsWith(href);

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 overflow-y-auto font-sans">
      <div className="px-4 py-6 border-b border-gray-200">
        <div className="text-base font-semibold text-gray-900">John's workspace</div>
        <div className="text-xs text-gray-400 mt-1">#WID12446875</div>
      </div>

      <div className="py-4">
        {menuConfig[0].items.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              href={item.href}
              className={`flex items-center px-4 py-2.5 text-sm group transition-all ${
                isActive(item.href)
                  ? "text-blue-600 bg-blue-50 border-r-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 mr-3 ${
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-gray-400 group-hover:text-gray-600"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <Link
            href="/logout"
            className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 group transition-all"
          >
            <LogOut className="w-4 h-4 mr-3 text-gray-400 group-hover:text-gray-600" />
            <span className="font-medium">Logout</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;