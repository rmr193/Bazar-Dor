"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [name, setName] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("অনুগ্রহ করে আগে লগইন করুন");
      router.push("/signin?redirect=/profile/update");
    } else if (user) {
      setName(user.name);
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      const msg = "অনুগ্রহ করে আপনার নাম প্রদান করুন";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    setUpdating(true);
    // Follows BetterAuth updateUser specification: authClient.updateUser({ name })
    const success = await updateUser(name.trim());
    setUpdating(false);

    if (success) {
      // toast.success is triggered in AuthContext, navigate back to profile
      router.push("/profile");
    } else {
      setFormError("তথ্য আপডেট করা যায়নি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।");
    }
  };

  if (isLoading || !user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <Spinner label="প্রোফাইল লোড হচ্ছে" />
      </main>
    );
  }

  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12">
      {/* Title & Subtitle */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          তথ্য আপডেট
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          আপনার প্রোফাইলের নাম পরিবর্তন করুন (BetterAuth Update User)
        </p>
      </div>

      {/* Main Form Card */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Error banner if any */}
        {formError && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-600 font-semibold flex items-center space-x-2">
            <span>⚠️</span>
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input field: Name */}
          <div>
            <label
              htmlFor="input-update-name"
              className="block text-xs font-semibold text-slate-700 mb-1.5"
            >
              নাম (Name)
            </label>
            <input
              id="input-update-name"
              type="text"
              required
              placeholder="আপনার পুরো নাম"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setFormError("");
              }}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Email read-only display */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              ইমেইল (Email)
            </label>
            <input
              type="email"
              disabled
              value={user.email}
              className="w-full px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-400 font-medium cursor-not-allowed"
            />
          </div>

          {/* Button: Update Information */}
          <button
            id="btn-update-information"
            type="submit"
            disabled={updating}
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-3 flex items-center justify-center space-x-2"
          >
            {updating ? (
              <span>তথ্য আপডেট হচ্ছে...</span>
            ) : (
              <span>Update Information</span>
            )}
          </button>
        </form>

        {/* Back to Profile Link */}
        <div className="text-center mt-6">
          <Link
            href="/profile"
            className="text-xs text-slate-500 hover:text-[#057A44] font-semibold transition-colors"
          >
            ← প্রোফাইলে ফিরে যান
          </Link>
        </div>
      </div>
    </main>
  );
}
