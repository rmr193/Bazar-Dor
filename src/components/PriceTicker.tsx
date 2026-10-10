"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import { toBnCurrency, getChangeBadgeInfo } from "@/lib/bengali";

// Price Ticker Component: Infinite scrolling price strip
export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Fetch products for the ticker
    async function loadTickerProducts() {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (e) {
        console.error("Error loading ticker products:", e);
      }
    }
    loadTickerProducts();
  }, []);

  if (products.length === 0) {
    return (
      <div className="bg-slate-900 text-slate-400 text-xs py-2 px-4 border-b border-slate-800 flex items-center justify-center">
        <span>বাজারদর লোড হচ্ছে...</span>
      </div>
    );
  }

  // Duplicate the list so the infinite marquee flows seamlessly
  const tickerItems = [...products, ...products];

  return (
    <div className="bg-slate-900 text-slate-100 py-2 overflow-hidden border-b border-slate-800 select-none shadow-inner">
      <div className="flex animate-marquee whitespace-nowrap items-center">
        {tickerItems.map((item, index) => {
          const badge = getChangeBadgeInfo(item.change);
          const unitText = item.unit === "kg" ? "কেজি" : item.unit === "litre" ? "লিটার" : item.unit === "dozen" ? "ডজন" : "পিস";

          return (
            <Link
              key={`${item.id}-${index}`}
              href={`/product/${item.slug || item.id}`}
              className="inline-flex items-center space-x-2 mx-4 text-xs sm:text-sm hover:text-emerald-400 transition-colors group"
            >
              <span className="text-base group-hover:scale-110 transition-transform">
                {item.image || "🛒"}
              </span>
              <span className="font-medium text-slate-200 group-hover:text-emerald-300">
                {item.nameBn}:
              </span>
              <span className="font-semibold text-emerald-400">
                {toBnCurrency(item.today)}/{unitText}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold border ${badge.colorClass}`}
              >
                {badge.text}
              </span>
              <span className="text-slate-600 ml-2">|</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
