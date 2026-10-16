"use client";

import React, { useEffect, useState } from "react";
import { Product } from "@/types";
import { getTopRisers, getTopFallers } from "@/lib/api";
import { logger } from "@/lib/logger";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

interface TrendSectionProps {
  title: string;
  emoji: string;
  emojiClass: string;
  products: Product[];
  loading: boolean;
}

function TrendSection({ title, emoji, emojiClass, products, loading }: TrendSectionProps) {
  return (
    <div>
      <div className="flex items-center space-x-2 mb-5">
        <span className={`${emojiClass} text-sm`}>{emoji}</span>
        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
          {title}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, idx) => <ProductCardSkeleton key={idx} />)
          : products.map((product) => <ProductCard key={product.id} product={product} />)}
      </div>
    </div>
  );
}

export default function MarketTrends() {
  const [risers, setRisers] = useState<Product[]>([]);
  const [fallers, setFallers] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [r, f] = await Promise.all([getTopRisers(6), getTopFallers(6)]);
        setRisers(r);
        setFallers(f);
      } catch (err) {
        logger.error("Market trends load error", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div id="দর-পরিবর্তন" className="py-6 sm:py-8 space-y-12">
      <TrendSection
        title="আজ দাম বেড়েছে"
        emoji="▲"
        emojiClass="text-rose-500"
        products={risers}
        loading={loading}
      />
      <TrendSection
        title="আজ দাম কমেছে"
        emoji="▼"
        emojiClass="text-emerald-600"
        products={fallers}
        loading={loading}
      />
    </div>
  );
}