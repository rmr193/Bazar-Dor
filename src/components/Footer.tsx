"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Category } from "@/types";
import { getCategories } from "@/lib/api";
import { FALLBACK_CATEGORIES } from "@/data/fallbackData";
import {
  PhoneCall,
  ShieldAlert,
  ArrowUp,
  MapPin,
  Heart,
  HelpCircle,
  ExternalLink,
} from "lucide-react";

export default function Footer() {
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);

  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (err) {
        console.error("Footer categories load error:", err);
      }
    }
    loadCategories();
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-300 mt-20 border-t border-slate-800">
      {/* 1. Consumer Hotline Callout Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white py-6 border-b border-emerald-600/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 backdrop-blur-xs">
              <ShieldAlert className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                অতিরিক্ত মূল্যে পণ্য বিক্রি বা ভোক্তা অধিকার লঙ্ঘনে অভিযোগ করুন
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100">
                জাতীয় ভোক্তা অধিকার সংরক্ষণ অধিদপ্তরের হটলাইনে সরাসরি যোগাযোগ করুন
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="tel:16121"
              id="btn-hotline-call"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm rounded-xl shadow-md transition-all hover:scale-105"
            >
              <PhoneCall className="w-4 h-4" />
              <span>হটলাইন: ১৬১২১</span>
            </a>
            <a
              href="tel:999"
              className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-colors backdrop-blur-xs"
            >
              <span>জরুরি: ৯৯৯</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Column 1: Brand & About */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center space-x-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                🛒
              </span>
              <span className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">
                বাজার দর
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              বাংলাদেশের প্রতিটি সাধারণ ভোক্তার জন্য নির্ভরযোগ্য ও স্বচ্ছ নিত্যপ্রয়োজনীয় পণ্যের বাজারদর পর্যবেক্ষণ প্ল্যাটফর্ম। কারওয়ান বাজার, খাতুনগঞ্জ সহ সারাদেশের প্রধান পাইকারি ও খুচরা বাজারের তথ্যের সমন্বয়ে প্রস্তুত।
            </p>
            <div className="pt-2 flex items-center space-x-3 text-xs text-slate-400">
              <span className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>দৈনিক লাইভ তথ্য</span>
              </span>
              <span>টিসিবি ও আঞ্চলিক বাজার নেটওয়ার্ক</span>
            </div>
          </div>

          {/* Column 2: Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              ক্যাটাগরি সমূহ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nameBn}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: More Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              অন্যান্য বিভাগ
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              {categories.slice(5).map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/category/${cat.slug}`}
                    className="hover:text-emerald-400 transition-colors flex items-center space-x-1.5"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.nameBn}</span>
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#সব-পণ্য"
                  className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center space-x-1"
                >
                  <span>সব পণ্য দেখুন</span>
                  <span>→</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Quick Links & Consumer Protection */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              ভোক্তা সেবা
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-400">
              <li>
                <Link href="/profile" className="hover:text-emerald-400 transition-colors">
                  আমার ওয়াচলিস্ট
                </Link>
              </li>
              <li>
                <Link href="/signin" className="hover:text-emerald-400 transition-colors">
                  অ্যাকাউন্টে সাইন ইন
                </Link>
              </li>
              <li>
                <a
                  href="http://dncrp.portal.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                >
                  <span>ভোক্তা অধিকার পোর্টাল</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="http://www.tcb.gov.bd/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-emerald-400 transition-colors flex items-center space-x-1"
                >
                  <span>টিসিবি (TCB) ওয়েবসাইট</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3. Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2 text-center sm:text-left">
            <span>© ২০২৬ বাজার দর। সর্বস্বত্ব সংরক্ষিত।</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline flex items-center gap-1">
              ভোক্তাদের ন্যায্যমূল্যের সুরক্ষায় নিবেদিত <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline ml-0.5" />
            </span>
          </div>

          {/* Back to top button */}
          <button
            onClick={scrollToTop}
            id="btn-back-to-top"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="উপরে যান"
          >
            <span>উপরে যান</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
