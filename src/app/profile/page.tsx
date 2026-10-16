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
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          আমার প্রোফাইল
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          আপনার অ্যাকাউন্টের তথ্য এখানে দেখুন।
        </p>
      </div>

      {/* Top User Card matching Figma Image 2 */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#057A44] text-white flex items-center justify-center font-bold text-2xl uppercase shadow-xs">
              {user.name ? user.name.charAt(0) : "U"}
            </div>
          )}
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          {/* Update Information Button -> Navigates to /profile/update */}
          <Link
            id="btn-update-info-header"
            href="/profile/update"
            className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#057A44] hover:bg-[#04683A] text-white rounded-xl text-xs sm:text-sm font-bold transition-colors shadow-xs"
          >
            <span>✏️</span>
            <span>তথ্য আপডেট করুন</span>
          </Link>

          {/* Sign Out Button matching Image 2 */}
          <button
            id="btn-signout"
            onClick={() => signOut()}
            className="inline-flex items-center space-x-1.5 px-4 py-2 border border-rose-300 text-rose-500 hover:bg-rose-50 rounded-xl text-xs sm:text-sm font-bold transition-colors"
          >
            <span>↩</span>
            <span>সাইন আউট</span>
          </button>
        </div>
      </div>

      {/* Bottom Card matching Image 2 with update button to /profile/update */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mt-6">
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
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-2 flex items-center justify-center space-x-2"
          >
            <span>আপডেট</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
