"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import AuthCardSkeleton from "@/components/AuthCardSkeleton";
import SocialButton from "@/components/SocialButton";

function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams?.get("redirect") || "/";

  const { signIn, signInSocial, user, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  // Safely redirect if user is already logged in
  useEffect(() => {
    if (user && !isLoading) {
      router.push(redirectTarget);
    }
  }, [user, isLoading, redirectTarget, router]);

  // Show skeleton loader while checking authentication state
  if (isLoading || user) {
    return <AuthCardSkeleton isSignup={false} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Form validation
    if (!email.trim() || !password) {
      const msg = "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দিন (Please enter email & password)";
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

    setSubmitting(true);
    const result = await signIn(email.trim(), password);
    setSubmitting(false);

    if (result.success) {
      // Navigate user to Home page (or redirect target) while preserving toast
      router.push(redirectTarget);
      router.refresh();
    } else {
      setFormError(
        result.error ||
          "ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন। (Invalid email or password)"
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
        result.error || "সোশ্যাল লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।"
      );
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Title for Login */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          লগইন / Sign In
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          বাজার দর ও পণ্য তুলনা দেখতে আপনার অ্যাকাউন্টে লগইন করুন
        </p>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Form Error Message Banner */}
        {formError && (
          <div
            id="signin-form-error"
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold flex items-center space-x-2"
          >
            <span className="text-base">⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="input-email"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              ইমেইল (Email)
            </label>
            <input
              id="input-email"
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

          <div>
            <label
              htmlFor="input-password"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              পাসওয়ার্ড (Password)
            </label>
            <input
              id="input-password"
              type="password"
              required
              placeholder="কমপক্ষে ৬ অক্ষর (Min 6 characters)"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError("");
              }}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          {/* Login Button */}
          <button
            id="btn-submit-signin"
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-2"
          >
            {submitting ? "লগইন হচ্ছে..." : "লগইন (Sign In)"}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
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
            id="btn-google-signin"
            provider="google"
            loading={socialLoading === "google"}
            disabled={socialLoading !== null}
            onClick={() => handleSocial("google")}
          />
          <SocialButton
            id="btn-github-signin"
            provider="github"
            loading={socialLoading === "github"}
            disabled={socialLoading !== null}
            onClick={() => handleSocial("github")}
          />
        </div>

        {/* Link for Register */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            অ্যাকাউন্ট নেই? (Don&apos;t have an account?){" "}
            <Link
              id="link-go-to-signup"
              href="/signup"
              className="text-[#057A44] font-bold hover:underline"
            >
              রেজিস্টার করুন (Register)
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

export default function SignInPage() {
  return (
    <Suspense fallback={<AuthCardSkeleton isSignup={false} />}>
      <SignInContent />
    </Suspense>
  );
}
