"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getBanglaDate } from "@/lib/bengali";
import { FALLBACK_CATEGORIES } from "@/data/fallbackData";
import { getCategories } from "@/lib/api";
import { Category } from "@/types";
import { Menu, X, User as UserIcon, LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const [banglaDate, setBanglaDate] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Set today's dynamic Bangla date on client side
  useEffect(() => {
    setBanglaDate(getBanglaDate());

    // Fetch dynamic categories
    async function loadCategories() {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (e) {
        console.error("Categories fetch error:", e);
      }
    }
    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Top Row: Logo + Date on Left, Auth buttons on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 border-b border-slate-100">
          {/* Left Side: Logo & Bangla Date */}
          <div className="flex flex-col justify-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <span className="text-3xl group-hover:scale-110 transition-transform">
                🛒
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-emerald-700 group-hover:text-emerald-800 transition-colors">
                বাজার দর
              </span>
            </Link>
            {/* Bangla Date underneath the logo */}
            <span className="text-xs sm:text-sm font-medium text-slate-500 mt-0.5">
              📅 {banglaDate || "আজকের বাজার দর"}
            </span>
          </div>

          {/* Right Side: Auth Buttons */}
          <div className="hidden sm:flex items-center space-x-3">
            {user ? (
              // When user is logged in
              <div className="flex items-center space-x-3 bg-slate-50 p-1.5 px-3 rounded-full border border-slate-200">
                <Link
                  href="/profile"
                  className="flex items-center space-x-2 text-slate-700 hover:text-emerald-700 font-medium text-sm transition-colors"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-7 h-7 rounded-full border border-emerald-500 bg-white"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      {user.name.charAt(0)}
                    </div>
                  )}
                  <span className="max-w-[120px] truncate">{user.name}</span>
                </Link>

                <div className="h-4 w-px bg-slate-300"></div>

                <Link
                  href="/profile"
                  className="text-xs font-semibold text-slate-600 hover:text-emerald-600 px-2 py-1 rounded-md hover:bg-white transition-colors"
                >
                  প্রোফাইল
                </Link>

                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 text-xs font-semibold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-md transition-colors"
                  title="সাইন আউট করুন"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>সাইন আউট</span>
                </button>
              </div>
            ) : (
              // When user is logged out
              <div className="flex items-center space-x-2">
                <Link
                  href="/signin"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-emerald-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex sm:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Second Row: Category Links (Desktop) */}
        <nav className="hidden sm:flex items-center justify-start overflow-x-auto py-2.5 space-x-1 no-scrollbar">
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              pathname === "/"
                ? "bg-emerald-100 text-emerald-800 font-semibold shadow-xs"
                : "text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
            }`}
          >
            🏠 হোম
          </Link>

          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-600 text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:text-emerald-700 hover:bg-slate-100"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-4 space-y-3">
          {/* Auth section on mobile */}
          <div className="py-2 border-b border-slate-100">
            {user ? (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-800">
                      {user.name}
                    </div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </div>
                </div>
                <div className="flex space-x-2 pt-2">
                  <Link
                    href="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-1.5 text-xs font-semibold bg-slate-100 text-slate-700 rounded-md"
                  >
                    প্রোফাইল
                  </Link>
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex-1 text-center py-1.5 text-xs font-semibold bg-rose-50 text-rose-600 rounded-md"
                  >
                    সাইন আউট
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link
                  href="/signin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-slate-700 bg-slate-100 rounded-lg"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>

          {/* Categories on mobile */}
          <div className="space-y-1">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
              ক্যাটাগরি সমূহ
            </div>
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/"
                  ? "bg-emerald-50 text-emerald-700 font-semibold"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
            >
              🏠 হোম
            </Link>
            {categories.map((cat) => {
              const isActive = pathname === `/category/${cat.slug}`;
              return (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive
                      ? "bg-emerald-600 text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.nameBn}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
