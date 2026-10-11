"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { UserPlus, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signIn, signInSocial, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<"google" | "github" | null>(null);

  // If already logged in
  if (user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm text-center max-w-sm w-full space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto">
            ✓
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            অ্যাকাউন্ট সক্রিয় আছে
          </h2>
          <p className="text-xs text-slate-500">
            {user.name} হিসেবে লগইন করা আছে।
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Link
              href="/profile"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              প্রোফাইলে যান
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password) return;

    if (password !== confirmPassword) {
      toast.error("দুই পাসওয়ার্ডের মিল নেই!");
      return;
    }

    if (password.length < 6) {
      toast.error("পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে");
      return;
    }

    setLoading(true);
    const success = await signUp(name.trim(), email.trim(), password);
    if (success) {
      // Auto sign-in after registration
      await signIn(email.trim(), password);
      router.push("/profile");
    }
    setLoading(false);
  };

  const handleSocial = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    const success = await signInSocial(provider);
    setSocialLoading(null);

    if (success) {
      router.push("/profile");
    }
  };

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 group">
            <span className="text-4xl group-hover:scale-110 transition-transform">
              🛒
            </span>
            <span className="text-3xl font-extrabold text-emerald-700">
              বাজার দর
            </span>
          </Link>
          <h1 className="text-xl font-bold text-slate-800 mt-3">
            নতুন অ্যাকাউন্ট তৈরি করুন
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            বাজার দরের নিয়মিত আপডেট এবং ওয়াচলিস্ট সংরক্ষণের সুবিধা নিন
          </p>
        </div>

        {/* Card Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name Field */}
            <div>
              <label
                htmlFor="input-name"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                আপনার পূর্ণ নাম
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-name"
                  type="text"
                  required
                  placeholder="যেমন: সাকিব হাসান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="input-signup-email"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                ইমেইল ঠিকানা
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-email"
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="input-signup-password"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-signup-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="input-confirm-password"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                পাসওয়ার্ড নিশ্চিত করুন
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-confirm-password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="btn-submit-signup"
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>সাইন আপ করুন</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-bold tracking-wider">
                অথবা সোশ্যাল অ্যাকাউন্ট
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="btn-signup-google"
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocial("google")}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
            >
              <span>🌐</span>
              <span>গুগল (Google)</span>
            </button>

            <button
              id="btn-signup-github"
              type="button"
              disabled={socialLoading !== null}
              onClick={() => handleSocial("github")}
              className="flex items-center justify-center space-x-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 transition-colors"
            >
              <span>🐙</span>
              <span>গিটহাব (GitHub)</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
