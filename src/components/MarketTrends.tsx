"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import { getTopRisers, getTopFallers } from "@/lib/api";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

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
    <div id="দর-পরিবর্তন" className="py-6 sm:py-8 space-y-12">
      {/* =========================================
          Section A: ▲ আজ দাম বেড়েছে (Top 6 Risers)
          ========================================= */}
      <div>
        <div className="flex items-center space-x-2 mb-5">
          <span className="text-rose-500 text-sm">▲</span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            আজ দাম বেড়েছে
          </h2>
        </div>

        {/* Risers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={`riser-skel-${idx}`} />
            ))
          ) : risers.length > 0 ? (
            risers.map((product) => (
              <ProductCard key={`riser-${product.id}`} product={product} />
            ))
          ) : null}
        </div>
      </div>

      {/* =========================================
          Section B: ▼ আজ দাম কমেছে (Top 6 Fallers)
          ========================================= */}
      <div>
        <div className="flex items-center space-x-2 mb-5">
          <span className="text-emerald-600 text-sm">▼</span>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            আজ দাম কমেছে
          </h2>
        </div>

        {/* Fallers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {loading ? (
            Array.from({ length: 6 }).map((_, idx) => (
              <ProductCardSkeleton key={`faller-skel-${idx}`} />
            ))
          ) : fallers.length > 0 ? (
            fallers.map((product) => (
              <ProductCard key={`faller-${product.id}`} product={product} />
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
}
