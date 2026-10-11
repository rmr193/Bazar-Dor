"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import AuthCardSkeleton from "@/components/AuthCardSkeleton";

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
      window.location.href = redirectTarget;
    }
  }, [user, isLoading, redirectTarget]);

  // Show skeleton loader while checking authentication state
  if (isLoading || user) {
    return <AuthCardSkeleton isSignup={false} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validation checks
    if (!email.trim() || !password) {
      const msg = "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড প্রদান করুন";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setSubmitting(true);
    const success = await signIn(email.trim(), password);
    setSubmitting(false);

    if (success) {
      // Navigate to Home page (or requested redirect path)
      window.location.href = redirectTarget || "/";
    } else {
      setFormError("ইমেইল বা পাসওয়ার্ড সঠিক নয়। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    }
  };

  const handleSocial = async (provider: "google" | "github") => {
    setFormError("");
    setSocialLoading(provider);
    const success = await signInSocial(provider);
    setSocialLoading(null);

    if (success) {
      // Social login navigates user to Home page
      window.location.href = "/";
    } else {
      setFormError("সোশ্যাল লগইন সম্পন্ন করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    }
  };

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Title & Subtitle matching Figma */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          সাইন ইন
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          বিস্তারিত দাম, বাজার তুলনা ও প্রোফাইল দেখতে অ্যাকাউন্টে ঢুকুন।
        </p>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Form Error Banner */}
        {formError && (
          <div
            id="signin-form-error"
            className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold flex items-center space-x-2"
          >
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

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
              পাসওয়ার্ড
            </label>
            <input
              id="input-password"
              type="password"
              required
              placeholder="কমপক্ষে ৮ অক্ষর"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setFormError("");
              }}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium placeholder:text-slate-400"
            />
          </div>

          <button
            id="btn-submit-signin"
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-2"
          >
            {submitting ? "সাইন ইন হচ্ছে..." : "সাইন ইন"}
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
            id="btn-google-signin"
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocial("google")}
            className="flex items-center justify-center space-x-2 py-2 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="truncate">Google দিয়ে চালিয়ে যান</span>
          </button>

          <button
            id="btn-github-signin"
            type="button"
            disabled={socialLoading !== null}
            onClick={() => handleSocial("github")}
            className="flex items-center justify-center space-x-2 py-2 px-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4 shrink-0 text-slate-800" fill="currentColor" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span className="truncate">GitHub দিয়ে চালিয়ে যান</span>
          </button>
        </div>

        {/* Switch to SignUp */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-600">
            অ্যাকাউন্ট নেই?{" "}
            <Link
              id="link-go-to-signup"
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
    <Suspense fallback={<AuthCardSkeleton isSignup={false} />}>
      <SignInContent />
    </Suspense>
  );
}
