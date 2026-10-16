"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getBanglaDate } from "@/lib/bengali";
import { FALLBACK_CATEGORIES } from "@/data/fallbackData";
import { getCategories } from "@/lib/api";
import { logger } from "@/lib/logger";
import { Category } from "@/types";
import { User, LogOut, ChevronDown, Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const [banglaDate, setBanglaDate] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBanglaDate(getBanglaDate());

    async function loadCategories() {
      try {
        const data = await getCategories();
        if (data && data.length > 0) {
          setCategories(data);
        }
      } catch (e) {
        logger.error("Categories fetch error", e);
      }
    }
    loadCategories();
  }, []);

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 sticky-safe">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Top Row: Logo & Date on Left, Auth on Right, Hamburger on mobile */}
        <div className="flex items-center justify-between h-14 sm:h-20 border-b border-slate-100">
          {/* Logo & Bangla Date */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#057A44] flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-xs shrink-0">
              🛒
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-xl font-extrabold text-slate-900 tracking-tight block leading-tight truncate">
                বাজার দর
              </span>
              <span className="text-[10px] sm:text-xs text-slate-400 font-normal block truncate">
                {banglaDate || "আজকের বাজার দর"}
              </span>
            </div>
          </Link>

          {/* Right: Auth Profile / Dropdown + Mobile menu toggle */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <div className="relative" ref={dropdownRef}>
              {user ? (
                <div>
                  <button
                    id="btn-user-profile-menu"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-1.5 py-1.5 px-1.5 sm:px-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
                    aria-label="ব্যবহারকারী মেনু"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#057A44] text-white flex items-center justify-center font-bold text-xs uppercase shadow-2xs">
                        {user.name ? user.name.charAt(0) : "U"}
                      </div>
                    )}
                    <span className="text-xs sm:text-sm font-bold text-slate-800 hidden sm:inline max-w-[8rem] truncate">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {/* Popover Dropdown */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-left animate-fade-zoom">
                      <div className="pb-3 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{user.name}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>

                      <div className="pt-2 space-y-1">
                        <Link
                          href="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center space-x-2 w-full px-2.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          <span>আমার প্রোফাইল</span>
                        </Link>

                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            signOut();
                          }}
                          className="flex items-center space-x-2 w-full px-2.5 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <LogOut className="w-3.5 h-3.5 text-rose-500" />
                          <span>সাইন আউট</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-1.5 sm:space-x-3">
                  <Link
                    id="nav-signin-link"
                    href="/signin"
                    title="লগইন"
                    className="px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#057A44] transition-colors"
                  >
                    <span className="sm:hidden">লগইন</span>
                    <span className="hidden sm:inline">লগইন</span>
                  </Link>
                  <Link
                    id="nav-signup-link"
                    href="/signup"
                    title="রেজিস্ট্রেশন"
                    className="px-3 sm:px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#057A44] hover:bg-[#04683A] rounded-lg transition-colors shadow-xs"
                  >
                    <span className="sm:hidden">রেজিস্টার</span>
                    <span className="hidden sm:inline">রেজিস্টার</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger toggle — only shown below md */}
            <button
              id="btn-mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              aria-label="ক্যাটাগরি মেনু"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Desktop: inline category row (md and up) */}
        <nav className="hidden md:flex items-center space-x-4 overflow-x-auto py-2.5 no-scrollbar text-sm">
          {categories.map((cat) => {
            const isActive = pathname === `/category/${cat.slug}`;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className={`flex items-center space-x-1.5 whitespace-nowrap transition-colors py-1 px-1.5 rounded-md ${
                  isActive
                    ? "text-[#057A44] font-bold"
                    : "text-slate-600 hover:text-slate-900 font-medium"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.nameBn}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile: collapsible category drawer (below md) */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="md:hidden border-t border-slate-100 py-2 animate-fade-zoom"
            style={{ transformOrigin: "top right" }}
          >
            <div className="grid grid-cols-2 gap-1.5 px-1">
              {categories.map((cat) => {
                const isActive = pathname === `/category/${cat.slug}`;
                return (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-emerald-50 text-[#057A44]"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span className="text-base">{cat.icon}</span>
                    <span className="truncate">{cat.nameBn}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}