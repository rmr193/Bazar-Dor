"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Product, Category, SortOption } from "@/types";
import { getCategoryBySlug, getProducts, sortProducts } from "@/lib/api";
import { toBnNum } from "@/lib/bengali";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import { ChevronDown, ArrowLeft, Home, Filter } from "lucide-react";

export default function CategoryPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [loading, setLoading] = useState<boolean>(true);

  // Load Category info and its products
  useEffect(() => {
    async function loadCategoryData() {
      if (!slug) return;
      setLoading(true);
      try {
        const [catData, prodData] = await Promise.all([
          getCategoryBySlug(slug),
          getProducts(slug),
        ]);
        setCategory(catData);
        setProducts(prodData);
      } catch (err) {
        console.error("Category data load error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCategoryData();
  }, [slug]);

  // Sort products based on selected option (Challenge C1)
  const sortedProducts = sortProducts(products, sortOption);

  // If loading, show skeleton cards
  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[60vh]">
        {/* Skeleton Header */}
        <div className="space-y-3 mb-8 animate-pulse">
          <div className="w-32 h-4 bg-slate-200 rounded"></div>
          <div className="w-56 h-8 bg-slate-200 rounded"></div>
        </div>
        {/* Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ProductCardSkeleton key={`cat-skel-${idx}`} />
          ))}
        </div>
      </main>
    );
  }

  // Empty state / Invalid slug state (404-style friendly message)
  if (!category && products.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-4xl mb-4 border border-amber-200">
          ⚠️
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
          ক্যাটাগরি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md">
          দুঃখিত, আপনি যে ক্যাটাগরিটি খুঁজছেন তা সঠিক নয় অথবা বর্তমানে এই বিভাগে কোনো পণ্য তালিকাভুক্ত নেই।
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>হোম পেজে ফিরে যান</span>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[60vh]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs text-slate-400 mb-6 font-medium">
        <Link href="/" className="hover:text-emerald-600 transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
          <span>হোম</span>
        </Link>
        <span>/</span>
        <span className="text-slate-600">ক্যাটাগরি</span>
        <span>/</span>
        <span className="text-emerald-700 font-bold">
          {category?.nameBn || slug}
        </span>
      </nav>

      {/* Category Header Row & Challenge C1 Sort Dropdown */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-slate-200">
        {/* Title + Icon */}
        <div className="flex items-center space-x-3">
          <span className="w-12 h-12 rounded-2xl bg-emerald-100/70 border border-emerald-200 flex items-center justify-center text-3xl">
            {category?.icon || "🛒"}
          </span>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>{category?.nameBn || "পণ্য তালিকা"}</span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {toBnNum(sortedProducts.length)} টি পণ্য
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              {category?.nameBn} বিভাগের সকল পণ্যের আজকের সর্বশেষ বাজার দর
            </p>
          </div>
        </div>

        {/* C1. Sort Control Dropdown with Chevron */}
        <div className="flex items-center space-x-2 self-start sm:self-center">
          <label
            htmlFor="sort-select"
            className="text-xs sm:text-sm font-bold text-slate-600 flex items-center gap-1"
          >
            <Filter className="w-3.5 h-3.5 text-emerald-600" />
            <span>সাজান:</span>
          </label>
          <div className="relative">
            <select
              id="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className="appearance-none bg-white border border-slate-300 text-slate-800 text-xs sm:text-sm font-semibold rounded-xl pl-3.5 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 shadow-xs cursor-pointer hover:border-slate-400 transition-colors"
            >
              <option value="default">ডিফল্ট</option>
              <option value="price-asc">দাম: কম থেকে বেশি</option>
              <option value="price-desc">দাম: বেশি থেকে কম</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Product Cards List */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {sortedProducts.map((product) => (
            <ProductCard key={`cat-prod-${product.id}`} product={product} />
          ))}
        </div>
      ) : (
        /* Empty State if category has 0 items */
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 max-w-lg mx-auto space-y-3">
          <span className="text-4xl">📦</span>
          <h2 className="text-lg font-bold text-slate-800">
            এই ক্যাটাগরিতে কোনো পণ্য নেই
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            বর্তমানে এই বিভাগে নতুন কোনো পণ্য যুক্ত করা হয়নি। অনুগ্রহ করে অন্য ক্যাটাগরি দেখুন।
          </p>
          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center space-x-1 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>হোম পেজে ফিরে যান</span>
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
