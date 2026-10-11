"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import { toBnNum, toBnCurrency, getChangeBadgeInfo } from "@/lib/bengali";
import toast from "react-hot-toast";
import {
  User as UserIcon,
  Mail,
  Calendar,
  LogOut,
  Edit2,
  Check,
  Bookmark,
  Trash2,
  ExternalLink,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, signOut, updateUser } = useAuth();

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>("");
  const [updating, setUpdating] = useState<boolean>(false);

  // Watchlist states
  const [watchlistProducts, setWatchlistProducts] = useState<Product[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState<boolean>(true);

  // Initialize editName when user loads
  useEffect(() => {
    if (user) {
      setEditName(user.name);
    }
  }, [user]);

  // Load Watchlist products from localStorage
  useEffect(() => {
    async function loadWatchlist() {
      setWatchlistLoading(true);
      try {
        const savedIds: number[] = JSON.parse(
          localStorage.getItem("bazardor_watchlist") || "[]"
        );

        if (savedIds.length === 0) {
          setWatchlistProducts([]);
          return;
        }

        const allProducts = await getProducts();
        const matched = allProducts.filter((p) => savedIds.includes(p.id));
        setWatchlistProducts(matched);
      } catch (err) {
        console.error("Watchlist load error:", err);
      } finally {
        setWatchlistLoading(false);
      }
    }

    loadWatchlist();
  }, []);

  // Remove single product from watchlist
  const handleRemoveFromWatchlist = (productId: number, productName: string) => {
    try {
      const savedIds: number[] = JSON.parse(
        localStorage.getItem("bazardor_watchlist") || "[]"
      );
      const filtered = savedIds.filter((id) => id !== productId);
      localStorage.setItem("bazardor_watchlist", JSON.stringify(filtered));
      setWatchlistProducts((prev) => prev.filter((p) => p.id !== productId));
      toast.success(`"${productName}" ওয়াচলিস্ট থেকে সরানো হয়েছে`);
    } catch {
      toast.error("মুছে ফেলা সম্ভব হয়নি");
    }
  };

  // Submit profile edit (Challenge C3)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      toast.error("নামের ঘর খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    const success = await updateUser(editName.trim());
    setUpdating(false);

    if (success) {
      setIsEditing(false);
    }
  };

  // Format joined date
  const formatJoinDate = (isoStr: string) => {
    try {
      const date = new Date(isoStr);
      return `${toBnNum(date.getDate())}/${toBnNum(
        date.getMonth() + 1
      )}/${toBnNum(date.getFullYear())}`;
    } catch {
      return "সম্প্রতি";
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-xs text-slate-500 font-medium">প্রোফাইল তথ্য লোড হচ্ছে...</p>
      </main>
    );
  }

  // Guest state (not logged in)
  if (!user) {
    return (
      <main className="max-w-md mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-4xl mb-4 border border-emerald-100">
          👤
        </div>
        <h1 className="text-2xl font-black text-slate-800">
          প্রোফাইল দেখতে সাইন ইন করুন
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-sm">
          আপনার প্রোফাইল পরিচালনা এবং সংরক্ষিত পণ্যের তালিকা দেখতে সাইন ইন অথবা
          নতুন অ্যাকাউন্ট তৈরি করুন।
        </p>
        <div className="mt-6 flex gap-3">
          <Link
            href="/signin"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-colors"
          >
            সাইন ইন করুন
          </Link>
          <Link
            href="/signup"
            className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
          >
            সাইন আপ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[75vh]">
      {/* 1. Profile Top Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Decorative blur */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-emerald-100/50 via-teal-50/20 to-transparent rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          {/* Avatar & User Details */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <div className="relative">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 border-emerald-500 shadow-sm object-cover"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-3xl border border-emerald-200">
                  {user.name.charAt(0)}
                </div>
              )}
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-lg shadow-xs" title="সক্রিয় সদস্য">
                <ShieldCheck className="w-4 h-4" />
              </span>
            </div>

            <div>
              {isEditing ? (
                /* Edit Name Form (Challenge C3) */
                <form
                  onSubmit={handleSaveProfile}
                  className="flex items-center space-x-2 mt-1"
                >
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="px-3 py-1.5 text-base font-bold bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                    placeholder="আপনার নাম লিখুন"
                  />
                  <button
                    type="submit"
                    disabled={updating}
                    className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50"
                    title="সংরক্ষণ করুন"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setEditName(user.name);
                    }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-bold transition-colors"
                    title="বাতিল"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                    {user.name}
                  </h1>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors"
                    title="নাম পরিবর্তন করুন (Challenge C3)"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              )}

              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{user.email}</span>
              </p>

              <div className="flex items-center space-x-3 mt-3 flex-wrap gap-y-1">
                <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                  <span>সক্রিয় সদস্য</span>
                </span>
                <span className="inline-flex items-center space-x-1 text-[11px] font-medium text-slate-400">
                  <Calendar className="w-3 h-3" />
                  <span>যোগদান: {formatJoinDate(user.createdAt)}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sign Out CTA */}
          <div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>সাইন আউট করুন</span>
            </button>
          </div>
        </div>

        {/* Challenge C3 Info Banner */}
        <div className="mt-6 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              আপনার নাম পরিবর্তন করতে নামের পাশের পেনসিল আইকনে ক্লিক করুন (নাম
              পরিবর্তন করলে স্বয়ংক্রিয়ভাবে নতুন অবতার তৈরি হবে)।
            </span>
          </div>
        </div>
      </section>

      {/* 2. Watchlist Section */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <Bookmark className="w-5 h-5 text-emerald-600" />
              <span>আমার ওয়াচলিস্ট ({toBnNum(watchlistProducts.length)})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              আপনার সংরক্ষিত নিত্যপ্রয়োজনীয় পণ্যের দ্রুত মূল্য ট্র্যাকিং তালিকা
            </p>
          </div>

          <Link
            href="/"
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>+ আরও পণ্য খুঁজুন</span>
          </Link>
        </div>

        {watchlistLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-2xl"></div>
            ))}
          </div>
        ) : watchlistProducts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center text-3xl mx-auto mb-3">
              🔖
            </div>
            <h3 className="text-base font-bold text-slate-800">
              ওয়াচলিস্টে কোনো পণ্য নেই
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              যেকোনো পণ্যের বিবরণ পেজে গিয়ে "ওয়াচলিস্ট" বাটনে ক্লিক করে পণ্য
              সংরক্ষণ করতে পারবেন।
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center space-x-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>পণ্যের তালিকা দেখুন</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlistProducts.map((item) => {
              const badge = getChangeBadgeInfo(item.change);
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 hover:border-emerald-300 p-5 shadow-xs transition-all flex flex-col justify-between group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                        {item.image || "🛒"}
                      </div>
                      <div>
                        <Link
                          href={`/product/${item.slug || item.id}`}
                          className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1 text-sm sm:text-base"
                        >
                          {item.nameBn}
                        </Link>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {item.categoryNameBn}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        handleRemoveFromWatchlist(item.id, item.nameBn)
                      }
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-md transition-colors"
                      title="ওয়াচলিস্ট থেকে মুছুন"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-slate-400 block font-medium">
                        আজকের দর
                      </span>
                      <span className="text-lg font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {toBnCurrency(item.today)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-md border ${badge.colorClass}`}
                      >
                        {badge.text}
                      </span>
                      <Link
                        href={`/product/${item.slug || item.id}`}
                        className="p-1.5 bg-slate-50 hover:bg-emerald-50 text-slate-500 hover:text-emerald-600 rounded-lg transition-colors"
                        title="বিস্তারিত দেখুন"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
