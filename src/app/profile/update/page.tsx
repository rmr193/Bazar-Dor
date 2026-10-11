"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { User, ArrowLeft, Check, ShieldCheck } from "lucide-react";

export default function UpdateProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [name, setName] = useState<string>("");
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
    if (!name.trim()) {
      toast.error("নামের ঘরটি খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    // Follows BetterAuth updateUser specification
    const success = await updateUser(name.trim());
    setUpdating(false);

    if (success) {
      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
      router.push("/profile");
    }
  };

  if (isLoading || !user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Top Back Link */}
        <div className="mb-6">
          <Link
            href="/profile"
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-slate-500 hover:text-emerald-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>প্রোফাইলে ফিরে যান</span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-3xl mx-auto mb-3">
              👤
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800">
              তথ্য আপডেট করুন
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              আপনার প্রোফাইলের নাম পরিবর্তন করুন (BetterAuth Update User)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input Field */}
            <div>
              <label
                htmlFor="input-update-name"
                className="block text-xs font-bold text-slate-700 mb-1.5"
              >
                পূর্ণ নাম (Name)
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  id="input-update-name"
                  type="text"
                  required
                  placeholder="আপনার নাম"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Email Field (Read only info) */}
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-1.5">
                ইমেইল ঠিকানা (পরিবর্তনযোগ্য নয়)
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full px-4 py-2.5 text-xs bg-slate-100 border border-slate-200 rounded-xl text-slate-400 font-medium cursor-not-allowed"
              />
            </div>

            {/* Update Information Button */}
            <button
              id="btn-update-information"
              type="submit"
              disabled={updating}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              {updating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Update Information</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/profile"
              className="text-xs text-slate-500 hover:text-slate-700 font-semibold"
            >
              বাতিল করুন
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
