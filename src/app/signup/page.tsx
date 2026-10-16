"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import AuthCardSkeleton from "@/components/AuthCardSkeleton";
import SocialButton from "@/components/SocialButton";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp, signInSocial, user, isLoading } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Safely redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push("/");
    }
  }, [user, isLoading, router]);

  // Show skeleton loader while checking authentication state
  if (isLoading || user) {
    return <AuthCardSkeleton isSignup={true} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Form validations
    if (!name.trim() || !email.trim() || !password) {
      const msg = "সকল প্রয়োজনীয় তথ্য পূরণ করুন (Please fill in all required fields)";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (!email.includes("@") || !email.includes(".")) {
      const msg = "সঠিক ইমেইল ঠিকানা দিন (Please enter a valid email address)";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    if (password.length < 6) {
      const msg = "পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে (Password must be at least 6 characters)";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    const result = await signUp(name.trim(), email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      // Examiner rubric: "If the user Register successfully then navigate him to his login page."
      router.push("/signin");
      router.refresh();
    } else {
      setFormError(
        result.error ||
          "রেজিস্ট্রেশন সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন। (Registration failed)"
      );
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setFormError("");
    setSocialLoading(provider);
    const result = await signInSocial(provider);
    setSocialLoading(null);

    if (result.success) {
      // Social login navigates user to Home page
      router.push("/");
      router.refresh();
    } else {
      setFormError(
        result.error || "সোশ্যাল লগইন সম্পন্ন করা যায়নি। (Social login failed)"
      );
    }
  };

  return (
    <main className="min-h-[85vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Title for Registration */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          রেজিস্ট্রেশন / Sign Up
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          বাজার দর অ্যাপে নতুন অ্যাকাউন্ট তৈরি করুন (Create an account)
        </p>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Form Error Banner */}
        {formError && (
          <div
            id="signup-form-error"
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold flex items-center space-x-2"
          >
            <span className="text-base">⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Field 1: Name */}
          <div>
            <label
              htmlFor="input-name"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              নাম (Name)
            </label>
            <input
              id="input-name"
              type="text"
              required
              placeholder="যেমন: রহিম উদ্দিন (Full Name)"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormError("");
              }}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Field 2: Email */}
          <div>
            <label
              htmlFor="input-signup-email"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              ইমেইল (Email)
            </label>
            <input
              id="input-signup-email"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setFormError("");
              }}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Field 3: Password */}
          <div>
            <label
              htmlFor="input-signup-password"
              className="block text-xs font-semibold text-slate-700 mb-1"
            >
              পাসওয়ার্ড (Password)
            </label>
            <input
              id="input-signup-password"
              type="password"
              required
              minLength={6}
              placeholder="কমপক্ষে ৬ অক্ষর (Min 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError("");
              }}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Field 4: Register Button */}
          <button
            id="btn-submit-signup"
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-3"
          >
            {submitting ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্টার করুন (Register Button)"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-5 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <span className="relative bg-white px-3 text-[11px] text-slate-400">
            অথবা সোশ্যাল লগইন (Or Social Login)
          </span>
        </div>

        {/* Social Login Buttons (Google + GitHub) */}
        <div className="grid grid-cols-2 gap-2.5">
          <SocialButton
            id="btn-google-signup"
            provider="google"
            loading={socialLoading === "google"}
            disabled={socialLoading !== null}
            onClick={() => handleSocial("google")}
          />
          <SocialButton
            id="btn-github-signup"
            provider="github"
            loading={socialLoading === "github"}
            disabled={socialLoading !== null}
            onClick={() => handleSocial("github")}
          />
        </div>

        {/* Link for Login */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            ইতিমধ্যে অ্যাকাউন্ট আছে? (Already have an account?){" "}
            <Link
              id="link-go-to-signin"
              href="/signin"
              className="text-[#057A44] font-bold hover:underline"
            >
              লগইন করুন (Login)
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
          ← হোম পেজে ফিরে যান (Back to Home)
        </Link>
      </div>
    </main>
  );
}
