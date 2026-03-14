"use client";

import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center p-4">
      {/* Main Card with Soft Shadow */}
      <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-gray-200/50 w-full max-w-md border border-gray-50">
        
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-[32px] font-bold text-gray-800">Login</h1>
          <p className="text-gray-400 mt-2 font-medium">Enter your details to continue</p>
        </div>

        {/* Form */}
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
          {/* Email Field */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Email</label>
            <input 
              type="email" 
              placeholder="example@email.com"
              className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-gray-700 font-bold mb-2 ml-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Enter your password"
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-100 focus:border-orange-400 transition-all"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible size={24} />
                ) : (
                  <AiOutlineEye size={24} />
                )}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center text-gray-500 cursor-pointer group">
              <input 
                type="checkbox" 
                className="mr-3 h-5 w-5 rounded-md border-gray-300 text-[#FF6D3F] focus:ring-[#FF6D3F] transition-all" 
              />
              <span className="text-[15px] font-medium">Remember me</span>
            </label>
            <a href="#" className="text-[#FF6D3F] text-[15px] font-semibold hover:opacity-80 transition-opacity">
              Forgot password?
            </a>
          </div>

          {/* Login Button with Custom Orange Glow */}
          <button 
            type="submit"
            className="w-full bg-[#FF6D3F] text-white font-bold py-4 rounded-2xl shadow-lg shadow-orange-200 hover:bg-[#ff5a24] transition-all transform active:scale-[0.98] mt-4"
          >
            Log in
          </button>
        </form>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-gray-500 font-medium">
            Don't have an account? {' '}
            <a href="#" className="text-gray-900 font-bold hover:underline underline-offset-4">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}