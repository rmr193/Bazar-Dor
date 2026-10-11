"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, signOut, updateUser } = useAuth();
  const [name, setName] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && !user) {
      toast.error("অনুগ্রহ করে আগে লগইন করুন");
      router.push("/signin?redirect=/profile");
    } else if (user) {
      setName(user.name);
    }
  }, [user, isLoading, router]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("নামের ঘরটি খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    const success = await updateUser(name.trim());
    setUpdating(false);

    if (success) {
      toast.success("প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!");
    }
  };

  if (isLoading || !user) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center">
        <div className="w-8 h-8 border-3 border-[#057A44] border-t-transparent rounded-full animate-spin"></div>
      </main>
    );
  }

  // Fallback user avatar photo
  const userAvatar =
    user.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

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

      {/* Top User Card matching Image 2 */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <img
            src={userAvatar}
            alt={user.name}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover bg-slate-100 border border-slate-200"
          />
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              {user.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut()}
          className="inline-flex items-center space-x-1.5 px-4 py-2 border border-rose-300 text-rose-500 hover:bg-rose-50 rounded-xl text-xs sm:text-sm font-bold transition-colors"
        >
          <span>↩</span>
          <span>সাইন আউট</span>
        </button>
      </div>

      {/* Bottom Update Card matching Image 2 */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-xs mt-6">
        <h3 className="text-sm font-bold text-slate-900 mb-4">তথ্য</h3>

        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label
              htmlFor="input-profile-name"
              className="block text-xs font-semibold text-slate-600 mb-1.5"
            >
              নাম
            </label>
            <input
              id="input-profile-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 text-sm bg-[#fafbfa] border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] transition-colors font-medium text-slate-800"
            />
          </div>

          <button
            id="btn-update-profile"
            type="submit"
            disabled={updating}
            className="w-full py-2.5 bg-[#057A44] hover:bg-[#04683A] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-colors shadow-xs mt-2"
          >
            {updating ? "আপডেট হচ্ছে..." : "আপডেট"}
          </button>
        </form>
      </div>
    </main>
  );
}
