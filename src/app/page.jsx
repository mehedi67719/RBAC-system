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
      <div className="w-full max-w-md bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/70 px-8 py-10">
        <div className="mb-8 text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316] font-semibold mb-3">
            RB
          </div>
          <p className="text-xs font-semibold tracking-[0.25em] text-[#F97316] uppercase">
            Welcome back
          </p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Sign in
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Enter your email and password to continue.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-medium text-slate-700">
                Password
              </label>
              <button
                type="button"
                className="text-[11px] font-medium text-[#F97316] hover:text-[#EA580C] transition-colors"
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
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#F97316] focus:ring-2 focus:ring-[#F97316]/20 transition-all pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={18} />
                ) : (
                  <AiOutlineEye size={18} />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="inline-flex items-center gap-2 text-[11px] text-slate-600">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-[#F97316] focus:ring-[#F97316] focus:ring-offset-0"
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center rounded-2xl bg-[#F97316] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-[#FDBA74]/40 hover:bg-[#EA580C] active:scale-[0.99] transition-transform transition-colors"
          >
            Log in
          </button>
        </form>
      </div>
    </div>
  );
}