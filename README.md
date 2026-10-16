# 🛒 বাজার দর (BazarDor) — Daily Market Commodity Price Tracker

[![Next.js 15](https://img.shields.io/badge/Next.js-15.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **BazarDor (বাজার দর)** is a modern, transparent web application dedicated to tracking daily essential commodity prices across Bangladesh. By aggregating verified price data from major wholesale and retail markets (such as Kawran Bazar and Khatungonj), the platform empowers everyday consumers with accurate, real-time price trends and analysis.

---

## 🌐 Live Demo & Repository
- **Live Application:** [https://bazar-dor-omega-six.vercel.app/](https://bazar-dor-omega-six.vercel.app/)
- **GitHub Repository:** [https://github.com/rmr193/Bazar-Dor](https://github.com/rmr193/Bazar-Dor)

---

## 🛠️ Technologies Used

| Technology | Purpose & Description |
|---|---|
| **Next.js 15 (App Router)** | Modern full-stack React framework with hybrid SSR, static generation, and optimized client routing |
| **React 19 & TypeScript** | Component-driven UI architecture with complete end-to-end type safety |
| **Tailwind CSS** | Responsive, modern utility styling based directly on Figma design specifications |
| **BetterAuth** | Client-side session persistence, Email/Password credential login, and Google / GitHub OAuth flows |
| **Lucide React** | Clean, minimalist, modern SVG vector iconography |
| **React Hot Toast** | Real-time interactive toast notifications for auth actions, validation, and user feedback |
| **Programming Hero OpenAPI** | Real-time endpoint for commodity prices, price change percentages, and category datasets |

---

## ✨ 5 Key Features

### 1. 🔝 Live Price Ticker & Category Navigation
- **Dynamic Brand Header:** Features the signature brand logo (`🛒 বাজার দর`) alongside an automatically calculated Bengali calendar date and current Gregorian date.
- **Two-Row Smart Navbar:** Second row displays category chips with custom icons, providing immediate feedback for active categories.
- **Infinite Marquee Price Ticker:** Positioned right beneath the navbar, an auto-scrolling ticker continuously highlights real-time commodity prices and upward (▲) / downward (▼) percentage fluctuations.

### 2. ⚖️ Daily Market Trends & Numeric Sorting (Bengali Numerals)
- **Top Risers (আজ দাম বেড়েছে ▲):** Displays the top commodities that experienced the highest price increase compared to yesterday.
- **Top Fallers (আজ দাম কমেছে ▼):** Highlights the commodities with the steepest price drop, helping budget-conscious shoppers.
- **Numeric Sort Dropdown:** Supports three sorting modes — `ডিফল্ট` (Default), `দাম: কম থেকে বেশি` (Price: Low to High), and `দাম: বেশি থেকে কম` (Price: High to Low). Implements a specialized Bengali numeral parser (`parseBnNum`) that converts Bengali numbers (`০-৯`) into native numeric values, ensuring mathematical sorting accuracy rather than alphabetical string comparison.

### 3. 🔍 Real-Time Search & Interactive Category Filter
- **Multi-Field Instant Search:** Filter commodities instantaneously by Bengali name, English slug, or category title.
- **Category Filter Chips:** Quickly toggle between all items or specific departments (Rice, Lentils, Oil, Vegetables, Fish, Meat, Spices, Dairy).
- **Result Counters & Quick Reset:** Displays active item count and includes a one-click reset button to clear search keywords and filters.

### 4. 🔒 Protected Product Details & Regional Comparison (`/product/[slug]`)
- **Route Protection:** Unauthenticated users attempting to view detailed product analytics are automatically notified with a toast and redirected to `/signin` with return URL memory.
- **Price Metric Cards:** Highlights Today's Price, National Average, Minimum Market Rate, and Maximum Market Rate.
- **Historical Comparison:** Timeline cards showing historical price changes compared to Yesterday, Last Week, and Last Month.
- **Regional Market Breakdown:** Searchable and filterable data table comparing commodity prices across divisional markets (Dhaka, Chittagong, Rajshahi, etc.).
- **Watchlist & Quick Share:** Save commodities to a personal watchlist or share direct links with family.

### 5. 🔐 Robust Authentication System (`/signin`, `/signup`)
- **Figma-Aligned Interface:** Clean, centered auth cards matching exact Figma design guidelines.
- **BetterAuth Engine:** Real Next.js route handler (`/api/auth/[...all]`) powered by official `better-auth` and `better-auth/react` client.
- **Credentials & Social Auth:** Sign in and sign up with Email/Password or 1-click Google and GitHub login.
- **Dual Error Feedback:** Form validation and API errors appear simultaneously in an in-form highlighted banner and through `react-hot-toast`.
- **Skeleton Loaders:** Integrated pulse skeleton card loaders during session validation and page hydration.
- **Live Account Creation:** Users can register new accounts live via `/signup` with Name, Email, and Password, and log in securely.

---

## 🏆 Bonus Challenge Implementations

- **Challenge C1 — Numeric Sorting:** Custom Bengali numeral parser (`parseBnNum`) converting Bengali numerals to numbers, ensuring accurate price sorting (`দাম: কম থেকে বেশি` and `দাম: বেশি থেকে কম`).
- **Challenge C2 — Comprehensive GitHub README:** High-quality English README with live links, tech stack details, 5 core features, and setup instructions.
- **Challenge C3 — Profile Update Feature:** User information update workflow on `/profile` and `/profile/update`, allowing users to modify and persist their display name within BetterAuth.

---

## 🎨 Minimal Footer
Adheres strictly to the Figma design by stripping out all redundant hotlines, portals, and link columns into a clean, single-line footer:
- **Left:** `বাজার দর — প্রয়োজনীয় পণ্যের দাম এক নজরে।` (BazarDor — Essential commodity prices at a glance.)
- **Right:** `সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।` (All prices are estimated; subject to change based on market conditions.)

---

## 🚀 Getting Started Locally

Follow these steps to run the application on your local machine:

### 1. Clone the repository
```bash
git clone https://github.com/rmr193/Bazar-Dor.git
cd Bazar-Dor
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env.local
```
Open `.env.local` and fill in the values — at minimum:
- `BETTER_AUTH_SECRET` (generate with `openssl rand -base64 32`)
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

To enable real Google/GitHub sign-in, add the four OAuth credentials (`GOOGLE_CLIENT_ID`/`SECRET` and `GITHUB_CLIENT_ID`/`SECRET`) to `.env.local`.

### 4. Start development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
