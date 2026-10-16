"use client";

import React, { useState, useEffect } from "react";
import { getBanglaDate } from "@/lib/bengali";

export default function HeroBanner() {
  // Start empty so we don't flash a hardcoded placeholder before hydration.
  const [banglaDate, setBanglaDate] = useState<string>("");

  useEffect(() => {
    setBanglaDate(getBanglaDate());
  }, []);

  return (
    <section className="pt-4 sm:pt-6 lg:pt-8 pb-3 sm:pb-4">
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 xl:p-12 border border-slate-200/80 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          {/* Illustration on top for mobile, right column on desktop */}
          <div className="lg:col-span-5 order-1 lg:order-2 flex justify-center lg:justify-end">
            <div className="w-44 h-40 sm:w-72 sm:h-60 lg:w-80 lg:h-64 relative flex items-center justify-center">
              <svg
                viewBox="0 0 320 260"
                className="w-full h-full drop-shadow-sm"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Shadow underneath */}
                <ellipse cx="160" cy="240" rx="110" ry="14" fill="#E2E8F0" />

                {/* Back vegetables */}
                <circle cx="165" cy="115" r="35" fill="#10B981" />
                <path d="M165 80 Q160 65 155 58" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
                <path d="M165 80 Q175 70 180 72" stroke="#047857" strokeWidth="3" strokeLinecap="round" />

                <circle cx="130" cy="125" r="30" fill="#EF4444" />
                <path d="M130 95 Q135 85 140 80" stroke="#78350F" strokeWidth="3.5" strokeLinecap="round" />
                <ellipse cx="120" cy="115" rx="5" ry="8" fill="#F87171" opacity="0.6" />

                <circle cx="205" cy="135" r="28" fill="#F97316" />
                <path d="M205 107 Q208 98 212 95" stroke="#15803D" strokeWidth="3" strokeLinecap="round" />

                <circle cx="100" cy="145" r="22" fill="#8B5CF6" />

                <circle cx="225" cy="148" r="18" fill="#FBBF24" />

                {/* Front Wooden Basket */}
                <path d="M60 145 H260 L240 235 H80 Z" fill="#9A4811" />
                <rect x="52" y="137" width="216" height="15" rx="7.5" fill="#78350F" />

                <path d="M90 152 L95 235" stroke="#78350F" strokeWidth="5" />
                <path d="M125 152 L128 235" stroke="#78350F" strokeWidth="5" />
                <path d="M160 152 L160 235" stroke="#78350F" strokeWidth="5" />
                <path d="M195 152 L192 235" stroke="#78350F" strokeWidth="5" />
                <path d="M230 152 L225 235" stroke="#78350F" strokeWidth="5" />
              </svg>
            </div>
          </div>

          {/* Left Text Column */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <span className="inline-block bg-[#EAF5EE] text-[#057A44] text-[11px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full">
              {banglaDate}
            </span>

            <h1 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 mt-3 tracking-tight leading-tight sm:leading-snug">
              আজকের বাজারের দাম এক নজরে
            </h1>

            <p className="text-xs sm:text-sm text-slate-500 mt-2.5 sm:mt-3 max-w-xl leading-relaxed">
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং দামের পরিবর্তন এক জায়গায়।
            </p>

            <div className="mt-5 sm:mt-6">
              <a
                href="#সব-পণ্য"
                id="btn-hero-cta"
                aria-label="সব পণ্য দেখুন (View all products)"
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 bg-[#057A44] hover:bg-[#04683A] text-white font-bold text-sm rounded-xl transition-all shadow-xs"
              >
                সব পণ্য দেখুন
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}