"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/types";
import { toBnCurrency, getUnitBn, getChangeBadgeInfo } from "@/lib/bengali";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const badge = getChangeBadgeInfo(product.change);
  const unitText = getUnitBn(product.unit);

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
    >
      {/* Top: Icon + Title & Unit */}
      <div className="flex items-start space-x-3.5">
        <div className="w-12 h-12 rounded-xl bg-slate-100/80 flex items-center justify-center text-2xl shrink-0">
          {product.image || "🛒"}
        </div>
        <div>
          <h3 className="font-bold text-slate-900 text-base leading-snug line-clamp-1">
            {product.nameBn}
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            {unitText}
          </p>
        </div>
      </div>

      {/* Bottom: Price + Badge */}
      <div className="mt-5 flex items-end justify-between pt-1">
        <div>
          <span className="block text-[11px] text-slate-400 font-medium">
            আজকের দাম
          </span>
          <span className="text-xl font-black text-slate-900 tracking-tight">
            {toBnCurrency(product.today)}
          </span>
        </div>

        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold ${
            product.change.dir === "up"
              ? "bg-rose-50 text-rose-600"
              : product.change.dir === "down"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {badge.text}
        </span>
      </div>
    </Link>
  );
}
