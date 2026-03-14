import React from "react";

const SettingsPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.25em] text-[#F97316] uppercase">
          Settings
        </p>
        <h1 className="mt-2 text-2xl sm:text-3xl font-semibold text-slate-900">
          Workspace settings
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage workspace preferences, notifications, and security options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              General
            </h2>
            <div className="space-y-4 text-sm">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Workspace name
                </label>
                <input
                  type="text"
                  placeholder="RBAC Workspace"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Timezone
                </label>
                <select className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all">
                  <option>(UTC+06:00) Dhaka</option>
                  <option>(UTC+05:30) Kolkata</option>
                  <option>(UTC+00:00) UTC</option>
                </select>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Notifications
            </h2>
            <div className="space-y-3 text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 text-[#F97316]" />
                <span className="text-slate-700">Email updates for new leads</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 text-[#F97316]" />
                <span className="text-slate-700">Task reminders</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 text-[#F97316]" />
                <span className="text-slate-700">Weekly summary report</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-100 bg-white/80 p-5 shadow-sm shadow-slate-200">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">
              Security
            </h2>
            <div className="space-y-3 text-xs text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 text-[#F97316]" />
                <span>Require 2FA for admins</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 text-[#F97316]" />
                <span>Notify on new device login</span>
              </label>
            </div>
          </div>

          <button className="inline-flex w-full items-center justify-center rounded-2xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-[#FDBA74]/40 hover:bg-[#EA580C] transition-colors">
            Save changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;

