"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getBanglaDate } from "@/lib/bengali";
import { FALLBACK_CATEGORIES } from "@/data/fallbackData";
import { getCategories } from "@/lib/api";
import { Category } from "@/types";
import { User, LogOut, ChevronDown } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  const [banglaDate, setBanglaDate] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setBanglaDate(getBanglaDate());

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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fallback user avatar image
  const userAvatar =
    user?.image ||
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Logo & Date on Left, User Profile on Right */}
        <div className="flex items-center justify-between h-16 sm:h-20 border-b border-slate-100">
          {/* Logo & Bangla Date */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#057A44] flex items-center justify-center text-white text-lg font-bold shadow-xs">
              🛒
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight block leading-tight">
                বাজার দর
              </span>
              <span className="text-xs text-slate-400 font-normal block">
                {banglaDate || "আজকের বাজার দর"}
              </span>
            </div>
          </Link>

          {/* Right: Auth Profile / Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {user ? (
              <div>
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 py-1.5 px-2 rounded-xl hover:bg-slate-50 transition-colors focus:outline-none"
                >
                  <img
                    src={userAvatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-slate-200"
                  />
                  <span className="text-sm font-bold text-slate-800 hidden sm:inline">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Popover Dropdown matching Figma Image 1 */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-left animate-in fade-in zoom-in-95 duration-100">
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
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  href="/signin"
                  className="px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-[#057A44] transition-colors"
                >
                  সাইন ইন
                </Link>
                <Link
                  href="/signup"
                  className="px-3.5 py-1.5 text-xs sm:text-sm font-bold text-white bg-[#057A44] hover:bg-[#04683A] rounded-lg transition-colors shadow-xs"
                >
                  সাইন আপ
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Second Row: Category Links */}
        <nav className="flex items-center space-x-3 sm:space-x-4 overflow-x-auto py-2.5 no-scrollbar text-xs sm:text-sm">
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
      </div>
    </header>
  );
}
