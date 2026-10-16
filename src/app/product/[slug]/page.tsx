"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Product } from "@/types";
import { getProduct, getProducts } from "@/lib/api";
import { logger } from "@/lib/logger";
import {
  toBnNum,
  toBnCurrency,
  getUnitBn,
  getChangeBadgeInfo,
  calculatePriceSummary,
} from "@/lib/bengali";
import ProductCard from "@/components/ProductCard";
import ProductCardSkeleton from "@/components/ProductCardSkeleton";
import {
  Home,
  Share2,
  Bookmark,
  BookmarkCheck,
  TrendingUp,
  TrendingDown,
  Minus,
  Store,
  MapPin,
  Calendar,
  AlertCircle,
  BarChart3,
  Search,
  Sparkles,
} from "lucide-react";

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams<{ slug: string | string[] }>();
  const slug = Array.isArray(params.slug) ? params.slug[0] ?? "" : params.slug ?? "";
  const { user, isLoading: authLoading } = useAuth();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [selectedDivision, setSelectedDivision] = useState<string>("all");
  const [marketSearch, setMarketSearch] = useState<string>("");

  // Protected Route Check (Requirement 4)
  useEffect(() => {
    if (!authLoading && !user) {
      toast.error("পণ্যের বিস্তারিত বিবরণ দেখতে অনুগ্রহ করে সাইন ইন করুন");
      router.push(`/signin?redirect=/product/${slug}`);
    }
  }, [authLoading, user, router, slug]);

  // Load product data & related category products
  useEffect(() => {
    async function loadData() {
      if (!slug) return;
      setLoading(true);
      try {
        const prod = await getProduct(slug);
        setProduct(prod);

        if (prod) {
          // Check watchlist in localStorage
          try {
            const raw = JSON.parse(
              localStorage.getItem("bazardor_watchlist") || "[]"
            );
            const savedList: number[] = Array.isArray(raw)
              ? raw.filter((v): v is number => typeof v === "number" && Number.isFinite(v))
              : [];
            setIsSaved(savedList.includes(prod.id));
          } catch {
            // Ignore storage errors
          }

          // Load related products
          const allInCategory = await getProducts(prod.category);
          setRelatedProducts(
            allInCategory.filter((p) => p.id !== prod.id).slice(0, 4)
          );
        }
      } catch (err) {
        logger.error("Product load error", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [slug]);

  // Toggle watchlist item
  const toggleWatchlist = () => {
    if (!product) return;
    try {
      const raw = JSON.parse(
        localStorage.getItem("bazardor_watchlist") || "[]"
      );
      // Validate that we have a real array of numbers (defence against bad storage)
      const savedList: number[] = Array.isArray(raw)
        ? raw.filter((v): v is number => typeof v === "number" && Number.isFinite(v))
        : [];

      let updated: number[];
      if (savedList.includes(product.id)) {
        updated = savedList.filter((id) => id !== product.id);
        setIsSaved(false);
        toast.success(`"${product.nameBn}" ওয়াচলিস্ট থেকে মুছে ফেলা হয়েছে`);
      } else {
        updated = [...savedList, product.id];
        setIsSaved(true);
        toast.success(`"${product.nameBn}" আপনার ওয়াচলিস্টে যোগ করা হয়েছে`);
      }
      localStorage.setItem("bazardor_watchlist", JSON.stringify(updated));
    } catch {
      toast.error("সংরক্ষণ করা সম্ভব হয়নি");
    }
  };

  // Share product
  const handleShare = async () => {
    if (!product) return;
    const shareUrl = typeof window !== "undefined" ? window.location.href : "";
    const shareTitle = `${product.nameBn} - আজকের বাজার দর (${toBnCurrency(product.today)})`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: `বাজার দর অ্যাপে ${product.nameBn}-এর আজকের মূল্য ও বাজারের তালিকা দেখুন।`,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("লিংক কপি করা হয়েছে!");
    } catch {
      toast.error("লিংক কপি করা সম্ভব হয়নি");
    }
  };

  // Loading skeleton state
  if (authLoading || (!user && !authLoading) || loading) {
    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[70vh]">
        {/* Breadcrumb Skeleton */}
        <div className="w-48 h-4 bg-slate-200 rounded animate-pulse mb-8"></div>

        {/* Hero Card Skeleton */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm animate-pulse space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-200"></div>
              <div className="space-y-2">
                <div className="w-24 h-4 bg-slate-200 rounded"></div>
                <div className="w-48 h-8 bg-slate-200 rounded"></div>
                <div className="w-32 h-4 bg-slate-200 rounded"></div>
              </div>
            </div>
            <div className="w-36 h-12 bg-slate-200 rounded-xl"></div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-20 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>

        {/* Markets Table Skeleton */}
        <div className="mt-8 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm animate-pulse space-y-4">
          <div className="w-48 h-6 bg-slate-200 rounded"></div>
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-lg"></div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Not Found state
  if (!product) {
    return (
      <main className="max-w-3xl mx-auto px-4 py-20 text-center min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-3xl bg-amber-50 text-amber-600 flex items-center justify-center text-4xl mb-4 border border-amber-200 shadow-sm">
          🔍
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800">
          পণ্যটি খুঁজে পাওয়া যায়নি
        </h1>
        <p className="text-sm sm:text-base text-slate-500 mt-2 max-w-md">
          দুঃখিত, আপনি যে পণ্যটির বিবরণ খুঁজছেন তা বর্তমানে ডাটাবেজে উপস্থিত নেই
          অথবা ইউআরএলটি ভুল হতে পারে।
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>হোমে ফিরে যান</span>
          </Link>
        </div>
      </main>
    );
  }

  const badge = getChangeBadgeInfo(product.change);
  const unitText = getUnitBn(product.unit);
  const summary = calculatePriceSummary(product);

  // Extract unique divisions from markets
  const divisions = Array.from(
    new Set(product.markets?.map((m) => m.division) || [])
  );

  // Filter markets
  const filteredMarkets = (product.markets || []).filter((m) => {
    const matchDivision =
      selectedDivision === "all" || m.division === selectedDivision;
    const matchSearch =
      !marketSearch ||
      m.market.toLowerCase().includes(marketSearch.toLowerCase()) ||
      m.division.toLowerCase().includes(marketSearch.toLowerCase());
    return matchDivision && matchSearch;
  });

  // Calculate historical differences
  const diffYesterday = product.today - product.yesterday;
  const diffLastWeek = product.today - product.lastWeek;
  const diffLastMonth = product.today - product.lastMonth;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 min-h-[70vh]">
      {/* 1. Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 text-xs sm:text-sm text-slate-500 mb-6 font-medium flex-wrap"
      >
        <Link
          href="/"
          className="hover:text-emerald-700 transition-colors flex items-center gap-1"
        >
          <Home className="w-3.5 h-3.5" />
          <span>হোম</span>
        </Link>
        <span>/</span>
        <Link
          href={`/category/${product.category}`}
          className="hover:text-emerald-700 transition-colors flex items-center gap-1"
        >
          <span>{product.categoryIcon}</span>
          <span>{product.categoryNameBn || "ক্যাটাগরি"}</span>
        </Link>
        <span>/</span>
        <span className="text-emerald-800 font-bold">{product.nameBn}</span>
      </nav>

      {/* 2. Hero Header Card */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/90 shadow-sm relative overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-emerald-100/50 via-teal-50/20 to-transparent rounded-full blur-3xl -z-0 pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
          {/* Product Icon & Titles */}
          <div className="flex items-start sm:items-center space-x-4 sm:space-x-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 flex items-center justify-center text-4xl sm:text-5xl shadow-inner shrink-0">
              {product.image || product.categoryIcon || "🛒"}
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                <Link
                  href={`/category/${product.category}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-emerald-800 bg-emerald-100/70 hover:bg-emerald-200/70 px-2.5 py-0.5 rounded-full transition-colors"
                >
                  <span>{product.categoryIcon}</span>
                  <span>{product.categoryNameBn}</span>
                </Link>
                <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full">
                  {unitText}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-2">
                {product.nameBn}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>আজকের যাচাইকৃত বাজার মূল্য তালিকা</span>
              </p>
            </div>
          </div>

          {/* Pricing & CTA Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center lg:items-end gap-4 sm:gap-6">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 sm:p-5 text-left sm:text-right">
              <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
                আজকের নির্ধারিত মূল্য
              </span>
              <div className="flex items-baseline space-x-2 sm:justify-end mt-1">
                <span className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
                  {toBnCurrency(product.today)}
                </span>
                <span className="text-xs sm:text-sm font-bold text-slate-500">
                  / {unitText.replace("প্রতি ", "")}
                </span>
              </div>
              <div className="mt-2 flex items-center sm:justify-end">
                <span
                  className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${badge.colorClass}`}
                >
                  <span>{badge.text}</span>
                  <span className="font-normal text-[11px]">
                    {badge.direction === "up"
                      ? "(দাম বৃদ্ধি)"
                      : badge.direction === "down"
                      ? "(দাম হ্রাস)"
                      : "(অপরিবর্তিত)"}
                  </span>
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center space-x-2">
              <button
                id="btn-toggle-watchlist"
                onClick={toggleWatchlist}
                className={`p-3 rounded-xl border font-semibold text-sm transition-all flex items-center justify-center space-x-2 ${
                  isSaved
                    ? "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-emerald-600"
                }`}
                title={isSaved ? "ওয়াচলিস্টে সংরক্ষিত" : "ওয়াচলিস্টে সংরক্ষণ করুন"}
                aria-label="ওয়াচলিস্ট বাটন"
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="w-5 h-5 fill-rose-500 text-rose-500" />
                    <span className="hidden sm:inline text-xs">সংরক্ষিত</span>
                  </>
                ) : (
                  <>
                    <Bookmark className="w-5 h-5" />
                    <span className="hidden sm:inline text-xs">ওয়াচলিস্ট</span>
                  </>
                )}
              </button>

              <button
                id="btn-share-product"
                onClick={handleShare}
                className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 hover:text-emerald-600 hover:bg-slate-50 font-semibold text-sm transition-all flex items-center justify-center space-x-2"
                title="পণ্য শেয়ার করুন"
                aria-label="শেয়ার বাটন"
              >
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline text-xs">শেয়ার</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3. Historical Price Timeline Cards */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-emerald-600" />
              <span>ঐতিহাসিক দর ও পরিবর্তনের তুলনা</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              বিগত ৩০ দিনের পর্যালোচিত তথ্য
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {/* Today */}
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-emerald-900">
                আজকের দর
              </span>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-black text-emerald-800">
                  {toBnCurrency(product.today)}
                </span>
                <span className="block text-[11px] text-emerald-700 font-medium mt-0.5">
                  সর্বশেষ লাইভ আপডেট
                </span>
              </div>
            </div>

            {/* Yesterday */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-600">
                গতকালের দর
              </span>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-800">
                  {toBnCurrency(product.yesterday)}
                </span>
                <div className="flex items-center space-x-1 text-[11px] font-semibold mt-0.5">
                  {diffYesterday > 0 ? (
                    <span className="text-rose-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +
                      {toBnNum(diffYesterday)} টাকা
                    </span>
                  ) : diffYesterday < 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {toBnNum(diffYesterday)} টাকা
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center">
                      <Minus className="w-3 h-3 mr-0.5" /> অপরিবর্তিত
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Last Week */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-600">
                গত সপ্তাহের দর
              </span>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-800">
                  {toBnCurrency(product.lastWeek)}
                </span>
                <div className="flex items-center space-x-1 text-[11px] font-semibold mt-0.5">
                  {diffLastWeek > 0 ? (
                    <span className="text-rose-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +
                      {toBnNum(diffLastWeek)} টাকা
                    </span>
                  ) : diffLastWeek < 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {toBnNum(diffLastWeek)} টাকা
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center">
                      <Minus className="w-3 h-3 mr-0.5" /> অপরিবর্তিত
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Last Month */}
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between">
              <span className="text-xs font-semibold text-slate-600">
                গত মাসের দর
              </span>
              <div className="mt-2">
                <span className="text-xl sm:text-2xl font-bold text-slate-800">
                  {toBnCurrency(product.lastMonth)}
                </span>
                <div className="flex items-center space-x-1 text-[11px] font-semibold mt-0.5">
                  {diffLastMonth > 0 ? (
                    <span className="text-rose-600 flex items-center">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +
                      {toBnNum(diffLastMonth)} টাকা
                    </span>
                  ) : diffLastMonth < 0 ? (
                    <span className="text-emerald-600 flex items-center">
                      <TrendingDown className="w-3 h-3 mr-0.5" />
                      {toBnNum(diffLastMonth)} টাকা
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center">
                      <Minus className="w-3 h-3 mr-0.5" /> অপরিবর্তিত
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Market Price Summary Cards */}
      <section className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Lowest */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xl border border-emerald-100">
            📉
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">
              সর্বনিম্ন বাজার দর
            </span>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {toBnCurrency(summary.minPrice)}
            </div>
          </div>
        </div>

        {/* Average */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xl border border-blue-100">
            ⚖️
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">
              জাতীয় গড় দর
            </span>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {toBnCurrency(summary.avgPrice)}
            </div>
          </div>
        </div>

        {/* Highest */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xl border border-rose-100">
            📈
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500">
              সর্বোচ্চ বাজার দর
            </span>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {toBnCurrency(summary.maxPrice)}
            </div>
          </div>
        </div>
      </section>

      {/* 5. Detailed Market Breakdown Table & Division Filter */}
      <section className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
              <Store className="w-5 h-5 text-emerald-600" />
              <span>বিভিন্ন বাজার ও বিভাগ ভিত্তিক দর</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              মোট {toBnNum(product.markets?.length || 0)}টি প্রধান পাইকারি ও খুচরা বাজারের দর তালিকা
            </p>
          </div>

          {/* Search within markets */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              id="input-search-markets"
              placeholder="বাজার বা বিভাগ খুঁজুন..."
              value={marketSearch}
              onChange={(e) => setMarketSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Division Filter Pills */}
        {divisions.length > 0 && (
          <div className="flex items-center space-x-1.5 overflow-x-auto py-4 border-b border-slate-100 no-scrollbar">
            <button
              onClick={() => setSelectedDivision("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                selectedDivision === "all"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              সকল বিভাগ ({toBnNum(product.markets?.length || 0)})
            </button>
            {divisions.map((div) => {
              const count = product.markets?.filter((m) => m.division === div).length || 0;
              return (
                <button
                  key={div}
                  onClick={() => setSelectedDivision(div)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap ${
                    selectedDivision === div
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {div} ({toBnNum(count)})
                </button>
              );
            })}
          </div>
        )}

        {/* Markets Table */}
        {filteredMarkets.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold">কোনো বাজার খুঁজে পাওয়া যায়নি</p>
            <p className="text-xs text-slate-400 mt-0.5">অন্য বিভাগ বা ফিল্টার চেষ্টা করুন</p>
          </div>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 text-[11px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="py-3 px-3 sm:px-4">বাজারের নাম</th>
                  <th className="py-3 px-3 sm:px-4">বিভাগ</th>
                  <th className="py-3 px-3 sm:px-4 text-center">সর্বনিম্ন দর</th>
                  <th className="py-3 px-3 sm:px-4 text-center">সর্বোচ্চ দর</th>
                  <th className="py-3 px-3 sm:px-4 text-right">গড় বাজার দর</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {filteredMarkets.map((market, idx) => {
                  const marketAvg = Math.round((market.min + market.max) / 2);
                  const isCheaper = marketAvg < product.today;
                  return (
                    <tr
                      key={`${market.market}-${idx}`}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Market Name */}
                      <td className="py-3.5 px-3 sm:px-4 font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500 shrink-0" />
                          <span>{market.market}</span>
                        </div>
                      </td>

                      {/* Division */}
                      <td className="py-3.5 px-3 sm:px-4">
                        <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
                          {market.division}
                        </span>
                      </td>

                      {/* Min Price */}
                      <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-emerald-700">
                        {toBnCurrency(market.min)}
                      </td>

                      {/* Max Price */}
                      <td className="py-3.5 px-3 sm:px-4 text-center font-bold text-slate-700">
                        {toBnCurrency(market.max)}
                      </td>

                      {/* Average & Difference */}
                      <td className="py-3.5 px-3 sm:px-4 text-right">
                        <span className="font-extrabold text-slate-900 block">
                          {toBnCurrency(marketAvg)}
                        </span>
                        <span
                          className={`text-[10px] font-semibold ${
                            isCheaper ? "text-emerald-600" : "text-rose-500"
                          }`}
                        >
                          {isCheaper
                            ? `(জাতীয় দর থেকে ${toBnNum(product.today - marketAvg)} টাকা কম)`
                            : `(জাতীয় দর থেকে ${toBnNum(marketAvg - product.today)} টাকা বেশি)`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* 6. Consumer Guidance Card */}
      <section className="mt-8 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-100 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>ভোক্তা পরামর্শ</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold">
              সঠিক দামে পণ্য কেনার জন্য টিপস
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl">
              নিত্যপ্রয়োজনীয় পণ্য কেনার পূর্বে স্থানীয় বাজারের পাশাপাশি পাইকারি
              বাজারের গড় দর তুলনা করুন। অতিরিক্ত দামে বিক্রি হলে জাতীয় ভোক্তা
              অধিকার সংরক্ষণ অধিদপ্তরে অবহিত করুন।
            </p>
          </div>
          <Link
            href={`/category/${product.category}`}
            className="px-5 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl text-xs sm:text-sm font-bold shadow-xs transition-transform hover:scale-105 shrink-0"
          >
            {product.categoryNameBn} বিভাগের সব পণ্য
          </Link>
        </div>
      </section>

      {/* 7. Related Category Products */}
      {relatedProducts.length > 0 && (
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <span>{product.categoryIcon}</span>
                <span>একই ক্যাটাগরির অন্যান্য পণ্য</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {product.categoryNameBn} বিভাগের আরও কিছু প্রয়োজনীয় পণ্য ও দর
              </p>
            </div>
            <Link
              href={`/category/${product.category}`}
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
            >
              <span>সবগুলো দেখুন</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {relatedProducts.map((relProd) => (
              <ProductCard key={`rel-${relProd.id}`} product={relProd} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
