"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Home, RefreshCw } from "lucide-react";
import { logger } from "@/lib/logger";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log the digest only (a stable string) so we don't re-fire on every
  // render in dev when `error` is a fresh reference each pass.
  const loggedDigest = useRef<string | null>(null);
  if (error.digest && loggedDigest.current !== error.digest) {
    loggedDigest.current = error.digest;
    logger.error("Unhandled application error", { message: error.message, digest: error.digest });
  }

  return (
    <main className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/90 shadow-sm text-center">
        <div className="w-24 h-24 rounded-3xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center text-4xl mx-auto mb-6 shadow-xs">
          ⚠️
        </div>

        <span className="text-xs font-black text-rose-600 tracking-widest uppercase bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
          ৫০০ ত্রুটি (Error 500)
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-4 tracking-tight">
          কিছু একটা সমস্যা হয়েছে
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
          দুঃখিত, প্রত্যাশিত আচরণে কিছু সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা
          করুন অথবা হোম পেজে ফিরে যান।
        </p>

        {error.digest ? (
          <p className="text-[10px] text-slate-400 mt-3 font-mono break-all">
            রিপোর্ট আইডি: {error.digest}
          </p>
        ) : null}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all hover:scale-105"
          >
            <RefreshCw className="w-4 h-4" />
            <span>আবার চেষ্টা করুন</span>
          </button>
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm rounded-xl transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>হোম পেজে ফিরে যান</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
