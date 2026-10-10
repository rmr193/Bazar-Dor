"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import { getTopRisers, getTopFallers } from "@/lib/api";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MarketTrends() {
  const [risers, setRisers] = useState<Product[]>([]);
  const [fallers, setFallers] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadTrends() {
      try {
        const [risersData, fallersData] = await Promise.all([
          getTopRisers(6),
          getTopFallers(6),
        ]);
        setRisers(risersData);
        setFallers(fallersData);
      } catch (err) {
        console.error("Market trends load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTrends();
  }, []);

  return (
    <section id="দর-পরিবর্তন" className="py-12 sm:py-16 space-y-16">
      {/* =========================================
          Section A: আজ দাম বেড়েছে ▲ (Top 6 Risers)
          ========================================= */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>আজ দাম বেড়েছে</span>
                <span className="text-emerald-600 font-extrabold text-sm sm:text-base px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                  ▲ শীর্ষ ৬
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                গতকালের তুলনায় যেসব নিত্যপণ্যের দাম বৃদ্ধি পেয়েছে
              </p>
            </div>
          </div>
        </div>

        {/* Risers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={`riser-skel-${idx}`} />
            ))
          ) : risers.length > 0 ? (
            risers.map((product) => (
              <ProductCard key={`riser-${product.id}`} product={product} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              আজ কোনো পণ্যের দাম বৃদ্ধির তথ্য পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>

      {/* =========================================
          Section B: আজ দাম কমেছে ▼ (Top 6 Fallers)
          ========================================= */}
      <div>
        <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-bold">
              <TrendingDown className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
                <span>আজ দাম কমেছে</span>
                <span className="text-rose-600 font-extrabold text-sm sm:text-base px-2 py-0.5 bg-rose-50 rounded border border-rose-200">
                  ▼ শীর্ষ ৬
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                গতকালের তুলনায় যেসব নিত্যপণ্যের দাম হ্রাস পেয়েছে
              </p>
            </div>
          </div>
        </div>

        {/* Fallers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={`faller-skel-${idx}`} />
            ))
          ) : fallers.length > 0 ? (
            fallers.map((product) => (
              <ProductCard key={`faller-${product.id}`} product={product} />
            ))
          ) : (
            <div className="col-span-full py-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              আজ কোনো পণ্যের দাম হ্রাসের তথ্য পাওয়া যায়নি
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
