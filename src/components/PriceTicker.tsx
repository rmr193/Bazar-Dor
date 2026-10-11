"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Product } from "@/types";
import { getProducts } from "@/lib/api";
import { toBnNum } from "@/lib/bengali";

export default function PriceTicker() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
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
    return null;
  }

  // Duplicate the list for seamless marquee
  const tickerItems = [...products, ...products];

  return (
    <div className="bg-white py-2 overflow-hidden border-y border-slate-200 select-none">
      <div className="flex animate-marquee whitespace-nowrap items-center text-xs">
        {tickerItems.map((item, index) => {
          const unitText =
            item.unit === "kg"
              ? "কেজি"
              : item.unit === "litre"
              ? "লিটার"
              : item.unit === "dozen"
              ? "ডজন"
              : "পিস";

          const isUp = item.change.dir === "up";
          const isDown = item.change.dir === "down";

          return (
            <Link
              key={`${item.id}-${index}`}
              href={`/product/${item.slug || item.id}`}
              className="inline-flex items-center space-x-1.5 mx-5 text-slate-700 hover:text-[#057A44] transition-colors"
            >
              <span>{item.image || "🛒"}</span>
              <span className="font-semibold">{item.nameBn}</span>
              <span className="text-slate-500">
                {toBnNum(item.today)} টাকা/{unitText}
              </span>
              <span
                className={`font-bold ml-1 ${
                  isUp
                    ? "text-rose-500"
                    : isDown
                    ? "text-emerald-600"
                    : "text-slate-400"
                }`}
              >
                {isUp ? "▲" : isDown ? "▼" : "—"}{" "}
                {toBnNum(Math.abs(item.change.pct))}%
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
