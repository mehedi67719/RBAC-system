"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      username: emailInput,
      password: passwordInput,
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex items-center justify-center px-4">
      <div className="w-full max-w-5xl bg-white rounded-[32px] shadow-2xl shadow-slate-200/70 overflow-hidden border border-slate-100 flex flex-col md:flex-row">
        {/* Left / Illustration + Branding */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#111827] via-[#1F2937] to-[#111827] text-white relative items-center justify-center px-10 py-12">
          <div className="absolute inset-0 opacity-20">
            <div className="w-40 h-40 rounded-full bg-[#F97316] blur-3xl absolute -top-10 -left-10" />
            <div className="w-56 h-56 rounded-full bg-[#38BDF8] blur-3xl absolute bottom-0 right-0" />
          </div>

          <div className="relative z-10 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Secure RBAC Platform
              </div>
              <h1 className="mt-4 text-3xl font-semibold leading-snug">
                Control access with
                <span className="block text-[#F97316]">confidence & clarity.</span>
              </h1>
            </div>

            <p className="text-sm text-slate-200 max-w-sm">
              Manage users, roles, and permissions in one intuitive dashboard. Stay compliant and keep your data safe.
            </p>

            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold">
                  RB
                </div>
                <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold">
                  AC
                </div>
                <div className="h-8 w-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs font-semibold">
                  +
                </div>
              </div>
              <div className="text-xs text-slate-300">
                <p className="font-semibold">Trusted by modern teams</p>
                <p>Role-based access for growing products.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right / Login form */}
        <div className="w-full md:w-1/2 px-8 sm:px-10 py-10 sm:py-12">
          <div className="mb-8">
            <p className="text-xs font-semibold tracking-[0.25em] text-[#F97316] uppercase">
              Welcome back
            </p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-semibold text-slate-900">
              Sign in to your workspace
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Enter your credentials to access the RBAC dashboard.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <input
                type="email"
                autoComplete="email"
                required
                placeholder="you@company.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-slate-700">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-medium text-[#F97316] hover:text-[#EA580C] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all pr-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="inline-flex items-center gap-2 text-xs text-slate-600">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316] focus:ring-offset-0"
                />
                <span>Remember this device</span>
              </label>
            </div>

            <button
              type="submit"
              className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FDBA74]/40 hover:bg-[#EA580C] active:scale-[0.99] transition-transform transition-colors"
            >
              Continue to dashboard
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-500">
            <p>
              Don&apos;t have access?{" "}
              <span className="font-semibold text-slate-800">
                Contact your administrator
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}