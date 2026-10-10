"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { toBnCurrency, getUnitBn, getChangeBadgeInfo } from "@/lib/bengali";
import { ArrowUpRight } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

// Reusable simple product card component
export default function ProductCard({ product }: ProductCardProps) {
  const badge = getChangeBadgeInfo(product.change);
  const unitText = getUnitBn(product.unit);

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-emerald-400 p-4 sm:p-5 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between hover:-translate-y-1"
    >
      <div>
        {/* Top row: Emoji illustration & Category badge */}
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 rounded-xl bg-slate-50 group-hover:bg-emerald-50/70 border border-slate-100 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
            {product.image || "🛒"}
          </div>
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
            {product.categoryNameBn || "সাধারণ"}
          </span>
        </div>

        {/* Product Name */}
        <div className="mt-4">
          <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.nameBn}
          </h3>
          {/* Unit line */}
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {unitText}
          </p>
        </div>
      </div>

      {/* Bottom: Price row and Change badge */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-end justify-between">
        <div>
          <span className="block text-[11px] font-medium text-slate-400">
            আজকের দাম
          </span>
          <span className="text-lg sm:text-xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
            {toBnCurrency(product.today)}
          </span>
        </div>

        {/* Change badge */}
        <div className="flex flex-col items-end">
          <span
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-bold border ${badge.colorClass}`}
          >
            <span>{badge.text}</span>
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 flex items-center group-hover:text-emerald-600">
            বিস্তারিত <ArrowUpRight className="w-3 h-3 ml-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
