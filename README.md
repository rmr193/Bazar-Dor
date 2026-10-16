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

For real Google/GitHub sign-in, complete the [OAuth Setup](#-oauth-setup-google--github) section below and add the four OAuth credentials.

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

## 🔐 OAuth Setup (Google & GitHub)

The app uses [BetterAuth](https://www.better-auth.com/) for social sign-in. To make the **Google** and **GitHub** buttons on `/signin` and `/signup` work with real providers, you need to register OAuth apps and paste the credentials into your environment.

The callback URL pattern that BetterAuth expects is:

```
{BASE_URL}/api/auth/callback/{provider}
```

You need to register **two callback URLs** if you support both `localhost` and Vercel (or you can register them all under one OAuth app — Google supports multiple URIs per client, GitHub only supports one per app so register two apps).

| Environment | Base URL | Google callback | GitHub callback |
|---|---|---|---|
| Local dev | `http://localhost:3000` | `http://localhost:3000/api/auth/callback/google` | `http://localhost:3000/api/auth/callback/github` |
| Vercel | `https://bazar-dor-omega-six.vercel.app` | `https://bazar-dor-omega-six.vercel.app/api/auth/callback/google` | `https://bazar-dor-omega-six.vercel.app/api/auth/callback/github` |

---

### 🟦 Google OAuth Setup

1. Open the [Google Cloud Console → APIs & Services → Credentials](https://console.cloud.google.com/apis/credentials).
2. Create (or select) a project.
3. **Configure the OAuth consent screen** (required before creating credentials):
   - User type: **External** (or Internal if you use Google Workspace).
   - App name, support email, developer contact email.
   - **Scopes:** add `openid`, `email`, and `profile`.
   - Add test users if you keep the app in "Testing" mode.
4. **Create credentials → OAuth client ID → Application type: Web application.**
5. Fill in **Authorized JavaScript origins:**
   - `http://localhost:3000`
   - `https://bazar-dor-omega-six.vercel.app`
6. Fill in **Authorized redirect URIs:**
   - `http://localhost:3000/api/auth/callback/google`
   - `https://bazar-dor-omega-six.vercel.app/api/auth/callback/google`
7. Click **Create**, then copy the **Client ID** and **Client Secret**.
8. Add them to your environment as `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

---

### ⬛ GitHub OAuth Setup

GitHub's OAuth Apps only allow **one** callback URL per app. Register two apps if you need both local and production:

1. Open [GitHub → Settings → Developer settings → OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. For the local app:
   - **Application name:** `Bazar Dor (Local)`
   - **Homepage URL:** `http://localhost:3000`
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
4. Click **Register application**, then **Generate a new client secret**.
5. Copy the **Client ID** and the generated **Client Secret**.
6. (Optional) Repeat the same steps for the production app, using `https://bazar-dor-omega-six.vercel.app` as the homepage and callback host.
7. Add the values to your environment as `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET`.

---

### ☁️ Adding the env vars to Vercel

1. Open your Vercel project → **Settings → Environment Variables**.
2. Add each of the following, scoped to **Production**, **Preview**, and **Development** as needed:
   - `BETTER_AUTH_SECRET`
   - `NEXT_PUBLIC_APP_URL` = `https://bazar-dor-omega-six.vercel.app`
   - `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
   - `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`
3. After saving, redeploy the project so the new variables take effect.

### ✅ Verifying it works

1. Restart `npm run dev` (or trigger a Vercel redeploy).
2. Visit `/signin`.
3. Click **Google** — you should be redirected to `accounts.google.com`, approve the app, and land back on `/` signed in.
4. Repeat with **GitHub**.
5. Open DevTools → Application → Cookies → confirm a `better-auth.session_token` cookie is set.

> **Note:** When running in production without the OAuth env vars, the server logs a warning at startup. This is intentional — it catches the common mistake of deploying without configuring the providers.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
