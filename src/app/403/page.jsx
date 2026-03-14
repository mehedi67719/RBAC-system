import React from "react";
import Link from "next/link";

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/70 px-8 py-10 text-center">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-500 font-semibold mb-3">
          403
        </div>
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Access denied
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          You don&apos;t have permission to view this page. If you think this is
          a mistake, please contact your administrator.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center rounded-2xl bg-[#F97316] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-[#FDBA74]/40 hover:bg-[#EA580C] transition-colors"
        >
          Go back to dashboard
        </Link>
      </div>
    </div>
  );
};

export default ForbiddenPage;

