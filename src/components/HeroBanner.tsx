"use client";

import React from "react";
import { ArrowDown, TrendingUp, ShieldCheck, ShoppingCart } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-slate-50 border-b border-slate-200 py-12 sm:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Eyebrow, Headings, Subtitle, CTA Button */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Eyebrow / small text */}
            <div className="inline-flex items-center space-x-2 bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-semibold px-3 py-1.5 rounded-full shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-emerald-600 animate-ping" />
              <span>✨ প্রতিদিনের নির্ভরযোগ্য ও হালনাগাদ বাজারদর প্ল্যাটফর্ম</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              নিত্যপ্রয়োজনীয় পণ্যের{" "}
              <span className="text-emerald-600 underline decoration-emerald-300 underline-offset-8">
                আজকের সঠিক দাম
              </span>{" "}
              এক নজরে জানুন
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              কারওয়ান বাজার, মিরপুর, চট্টগ্রাম, রাজশাহীসহ সারা দেশের প্রধান প্রধান পাইকারি ও খুচরা বাজারের চাল, ডাল, তেল, মাছ, মাংস ও শাকসবজির সর্বশেষ দাম যাচাই করুন এবং বাজার করুন নিশ্চিন্তে।
            </p>

            {/* CTA Button & Quick Stats */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              {/* Primary CTA button with anchor link #সব-পণ্য */}
              <a
                href="#সব-পণ্য"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <span>আজকের সব পণ্য দেখুন</span>
                <ArrowDown className="w-5 h-5 animate-bounce" />
              </a>

              {/* Secondary Helper Link */}
              <a
                href="#দর-পরিবর্তন"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-3.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold text-base rounded-xl shadow-xs transition-colors"
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>আজকের ওঠানামা</span>
              </a>
            </div>

            {/* Feature Highlights underneath CTA */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 border-t border-slate-200/80 max-w-lg mx-auto lg:mx-0">
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-100 text-center lg:text-left">
                <div className="text-base sm:text-lg font-extrabold text-emerald-700">৩২+</div>
                <div className="text-xs text-slate-500 font-medium">নিত্যপণ্য</div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-100 text-center lg:text-left">
                <div className="text-base sm:text-lg font-extrabold text-emerald-700">১২টি</div>
                <div className="text-xs text-slate-500 font-medium">প্রধান বাজার</div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-lg border border-slate-100 text-center lg:text-left">
                <div className="text-base sm:text-lg font-extrabold text-emerald-700">১০০%</div>
                <div className="text-xs text-slate-500 font-medium">ফ্রি তথ্য</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Illustration / Cards */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Decorative background glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-3xl blur-xl opacity-30 animate-pulse"></div>

              {/* Main Visual Box */}
              <div className="relative bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">🧺</span>
                    <div>
                      <h3 className="font-bold text-slate-800 text-sm">তাজা বাজার দর</h3>
                      <p className="text-xs text-slate-500">প্রতিদিন সকালে হালনাগাদ</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold rounded-full">
                    লাইভ
                  </span>
                </div>

                {/* Sample Market Price Badges */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🍚</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">স্বর্ণমাছি চাল</div>
                        <div className="text-xs text-slate-500">প্রতি কেজি</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">১৪৮ টাকা</div>
                      <div className="text-xs font-bold text-emerald-600">▲ ২.১%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🥔</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">গোল আলু</div>
                        <div className="text-xs text-slate-500">প্রতি কেজি</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">৩০ টাকা</div>
                      <div className="text-xs font-bold text-rose-600">▼ ৬.২%</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-slate-50 hover:bg-emerald-50/60 rounded-xl border border-slate-100 transition-colors">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🐠</span>
                      <div>
                        <div className="text-sm font-bold text-slate-800">ইলিশ মাছ</div>
                        <div className="text-xs text-slate-500">প্রতি কেজি</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-slate-900">১,৮৫০ টাকা</div>
                      <div className="text-xs font-bold text-emerald-600">▲ ৩.৪%</div>
                    </div>
                  </div>
                </div>

                {/* Bottom trust tag */}
                <div className="pt-2 flex items-center justify-center space-x-2 text-xs text-slate-500 bg-slate-50 py-2 rounded-lg">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>জাতীয় ভোক্তা অধিকার ও বাজার সমিতি অনুমোদিত মনিটরিং</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
