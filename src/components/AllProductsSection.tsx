"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Product, Category, SortOption } from "@/types";
import { getProducts, getCategories, sortProducts } from "@/lib/api";
import { logger } from "@/lib/logger";
import { toBnNum } from "@/lib/bengali";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { Search, ChevronDown, RefreshCw } from "lucide-react";

export default function AllProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [loading, setLoading] = useState<boolean>(true);

  // Load all products and categories
  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, catData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(prodData);
        setCategories(catData);
      } catch (err) {
        logger.error("All products fetch error", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Filter products by selected category and search query (memoised)
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === "all" || item.category === selectedCategory;

      const matchesSearch =
        q === "" ||
        item.nameBn.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q) ||
        item.categoryNameBn.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Sort products with Bengali numerals support (Challenge C1) — memoised
  const displayedProducts = useMemo(
    () => sortProducts(filteredProducts, sortOption),
    [filteredProducts, sortOption]
  );

  // Pre-compute the product count per category once so the chip row doesn't
  // re-scan the product list for every category on every render.
  const countsByCategory = useMemo(() => {
    const m = new Map<string, number>();
    for (const p of products) m.set(p.category, (m.get(p.category) ?? 0) + 1);
    return m;
  }, [products]);

  return (
    <section id="সব-পণ্য" className="py-8 sm:py-12 lg:py-16 scroll-mt-24">
      {/* Header with Title and Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg sm:text-xl lg:text-2xl font-black text-slate-900 tracking-tight">
            সব পণ্য
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            দৈনন্দিন বাজারের সকল নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ মূল্য তালিকা
          </p>
        </div>

        {/* Search + Sort: stack on mobile, inline on sm+ */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="পণ্য খুঁজুন (যেমন: চাল, তেল)..."
              className="w-full pl-10 pr-9 py-2.5 sm:py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#057A44] text-slate-900 placeholder-slate-400 shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 py-1 px-1"
                aria-label="অনুসন্ধান মুছুন"
              >
                মুছুন
              </button>
            )}
          </div>

          <div className="relative w-full sm:min-w-[170px] sm:w-auto">
            <select
              id="home-sort-select"
              aria-label="সাজান"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="w-full appearance-none bg-white border border-slate-200 text-slate-800 text-sm font-medium rounded-xl pl-3.5 pr-8 py-2.5 sm:py-2 focus:outline-none focus:border-[#057A44] shadow-xs cursor-pointer transition-colors"
            >
              <option value="default">সাজান: ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Category Filter Chips/Tabs — horizontally scrollable, touch-friendly */}
      <div
        className="flex items-center space-x-2 overflow-x-auto pb-3 mb-5 sm:mb-6 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0"
        role="tablist"
        aria-label="ক্যাটাগরি ফিল্টার"
      >
        <button
          onClick={() => setSelectedCategory("all")}
          className={`shrink-0 px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-xs min-h-[40px] ${
            selectedCategory === "all"
              ? "bg-[#057A44] text-white"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          সব পণ্য ({toBnNum(products.length)})
        </button>

        {categories.map((cat) => {
          const count = countsByCategory.get(cat.slug) ?? 0;
          const isSelected = selectedCategory === cat.slug;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`shrink-0 inline-flex items-center space-x-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shadow-xs min-h-[40px] ${
                isSelected
                  ? "bg-[#057A44] text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.nameBn}</span>
              <span
                className={`text-[11px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? "bg-[#04683A] text-emerald-100" : "bg-slate-100 text-slate-500"
                }`}
              >
                {toBnNum(count)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result Count and Reset Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 mb-5 sm:mb-6 font-medium">
        <span>
          মোট{" "}
          <strong className="text-slate-800 font-bold">
            {toBnNum(displayedProducts.length)}
          </strong>{" "}
          টি পণ্য প্রদর্শিত হচ্ছে
        </span>
        {(selectedCategory !== "all" || searchQuery || sortOption !== "default") && (
          <button
            onClick={() => {
              setSelectedCategory("all");
              setSearchQuery("");
              setSortOption("default");
            }}
            className="self-start sm:self-auto text-[#057A44] hover:text-[#04683A] font-semibold inline-flex items-center space-x-1 py-1"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            <span>সব রিসেট করুন</span>
          </button>
        )}
      </div>

      {/* 2-4 Columns Responsive Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5">
        {loading ? (
          Array.from({ length: 8 }).map((_, idx) => (
            <ProductCardSkeleton key={`all-skel-${idx}`} />
          ))
        ) : displayedProducts.length > 0 ? (
          displayedProducts.map((product) => (
            <ProductCard key={`all-prod-${product.id}`} product={product} />
          ))
        ) : (
          <div className="col-span-full py-12 sm:py-16 text-center bg-white rounded-2xl sm:rounded-3xl border border-slate-200 space-y-3 px-4">
            <span className="text-4xl">🔍</span>
            <h3 className="text-base sm:text-lg font-bold text-slate-800">
              কোনো পণ্য পাওয়া যায়নি
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
              আপনার খোঁজা পণ্যটি এই মুহূর্তে পাওয়া যাচ্ছে না। অন্য নাম দিয়ে চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
                setSortOption("default");
              }}
              className="mt-2 px-4 py-2.5 bg-[#057A44] text-white text-xs font-bold rounded-lg hover:bg-[#04683A] transition-colors"
            >
              সব পণ্য দেখুন
            </button>
          </div>
        )}
      </div>
    </section>
  );
}