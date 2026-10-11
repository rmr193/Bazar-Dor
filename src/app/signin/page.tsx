"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/";

  const { signIn, signInSocial, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  if (user) {
    router.push(redirectTarget);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    const success = await signIn(email, password);
    setLoading(false);

    if (success) {
      router.push(redirectTarget);
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setSocialLoading(provider);
    const success = await signInSocial(provider);
    setSocialLoading(null);

    if (success) {
      router.push(redirectTarget);
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          সাইন ইন
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Main Card matching Image 3 */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="input-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              ইমেইল
            </label>
            <input
              id="input-email"
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
              htmlFor="input-password"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              পাসওয়ার্ড
            </label>
            <input
              id="input-password"
              type="password"
              required
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          <button
            id="btn-submit-signin"
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-2"
          >
            {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
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

        {/* Switch to SignUp */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              href="/signup"
              className="text-[#057A44] font-bold hover:underline"
            >
              সাইন আপ করুন
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

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-[#057A44] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
