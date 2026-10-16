"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, signOut } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("অনুগ্রহ করে আগে লগইন করুন");
      router.push("/signin?redirect=/profile");
    }
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <Spinner label="প্রোফাইল লোড হচ্ছে" />
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-3 sm:px-6 py-6 sm:py-10 lg:py-12">
      {/* Header */}
      <div className="mb-5 sm:mb-6">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* Top User Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 lg:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-[#057A44] text-white flex items-center justify-center font-bold text-xl sm:text-2xl uppercase shadow-xs shrink-0">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-base sm:text-xl font-bold text-slate-900 truncate">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5 truncate">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:space-x-2.5 self-stretch sm:self-auto">
          {/* Update Information Button */}
          <Link
            id="btn-update-info-header"
            href="/profile/update"
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 sm:py-2 bg-[#057A44] hover:bg-[#04683A] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs min-h-[40px]"
          >
            <span>✏️</span>
            <span>তথ্য আপডেট</span>
          </Link>

          {/* Sign Out Button */}
          <button
            id="btn-signout"
            onClick={() => signOut()}
            className="flex-1 sm:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 sm:py-2 border border-rose-300 text-rose-500 hover:bg-rose-50 rounded-xl text-xs sm:text-sm font-bold transition-colors min-h-[40px]"
          >
            <span>↩</span>
            <span>সাইন আউট</span>
          </button>
        </div>
      </div>

      {/* Bottom Card */}
      <div className="bg-white rounded-2xl p-5 sm:p-7 lg:p-8 border border-slate-200/80 shadow-xs mt-5 sm:mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-900">তথ্য</h3>
          <Link
            href="/profile/update"
            className="text-xs font-bold text-[#057A44] hover:underline"
          >
            সম্পাদনা করুন →
          </Link>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">
              নাম
            </label>
            <div className="w-full px-4 py-2.5 text-sm bg-[#fafbfa] border border-slate-200 rounded-xl font-medium text-slate-800">
              {user.name}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">
              ইমেইল
            </label>
            <div className="w-full px-4 py-2.5 text-xs bg-[#fafbfa] border border-slate-200 rounded-xl font-medium text-slate-500">
              {user.email}
            </div>
          </div>

          {/* Clicking Update Information button takes user to /profile/update */}
          <Link
            id="btn-update-info-card"
            href="/profile/update"
            className="w-full py-3 sm:py-2.5 bg-[#057A44] hover:bg-[#04683A] text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-2 flex items-center justify-center space-x-2 min-h-[44px]"
          >
            <span>আপডেট</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
