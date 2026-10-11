import React from "react";
import Link from "next/link";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm text-center">
        {/* Visual Badge */}
        <div className="w-24 h-24 rounded-3xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center text-4xl mx-auto mb-6 shadow-xs">
          🛒
        </div>

        <span className="text-xs font-black text-emerald-600 tracking-widest uppercase bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          ৪০৪ ত্রুটি (Error 404)
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 tracking-tight">
          পৃষ্ঠাটি খুঁজে পাওয়া যায়নি
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          দুঃখিত, আপনি যে লিংক বা পাতাটি খুঁজছেন তা হয়তো ভুল ঠিকানায় রয়েছে অথবা বর্তমানে উপলব্ধ নেই।
        </p>

        {/* CTA Button: হোম পেজে ফিরে যান */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            id="btn-not-found-home"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
          <Link
            href="/#সব-পণ্য"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>সব পণ্য খুঁজুন</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
