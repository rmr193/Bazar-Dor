"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInSocial, user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  if (user) {
    router.push("/");
    return null;
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
    setLoading(false);

    if (success) {
      router.push("/signin");
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    const success = await signInSocial(provider);
    setSocialLoading(null);

    if (success) {
      router.push("/");
    }
  };

  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          অ্যাকাউন্ট তৈরি করুন
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।
        </p>
      </div>

      {/* Main Card matching Image 4 */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="input-name"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              নাম
            </label>
            <input
              id="input-name"
              type="text"
              required
              placeholder="যেমন: রহিম উদ্দিন"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="input-signup-email"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              ইমেইল
            </label>
            <input
              id="input-signup-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="input-signup-password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="input-signup-password"
              type="password"
              required
              minLength={6}
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          <div>
            <label
              htmlFor="input-confirm-password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              পাসওয়ার্ড নিশ্চিত করুন
            </label>
            <input
              id="input-confirm-password"
              type="password"
              required
              placeholder="আবার লিখুন"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          <button
            id="btn-submit-signup"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-3"
          >
            {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] text-slate-400">
            অথবা
          </span>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocial("google")}
            className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
          >
            <span className="font-bold text-sm">G</span>
            <span className="truncate">Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocial("github")}
            className="flex items-center justify-center space-x-1.5 py-2 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
          >
            <span className="font-bold text-sm">🐙</span>
            <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Switch to SignIn */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            অ্যাকাউন্ট আছে?{" "}
            <Link
              href="/signin"
              className="text-[#057A44] font-bold hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </div>
      </div>

      {/* Back to Home Link */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
        >
          ← হোম পেজে ফিরে যান
        </Link>
      </div>
    </main>
  );
}
