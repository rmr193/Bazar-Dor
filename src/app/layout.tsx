import type { Metadata, Viewport } from "next";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাজার দর - দৈনন্দিন পণ্যের সঠিক বাজার মূল্য",
  description: "বাংলাদেশের বিভিন্ন বাজারের নিত্যপ্রয়োজনীয় পণ্যের আজকের সর্বশেষ দাম ও বাজারদর এক নজরে জানুন।",
  keywords: ["বাজার দর", "Bazar Dor", "নিত্যপ্রয়োজনীয় পণ্যের দাম", "চাল", "ডাল", "তেল", "সবজি", "বাংলাদেশ বাজার দর"],
  authors: [{ name: "Bazar Dor Team" }],
};

// Viewport meta — controls how the page is rendered on mobile.
// `viewportFit: cover` lets our safe-area insets actually work on iPhone X+.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#057A44",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans bg-[#f3f5f2] text-slate-900">
        <AuthProvider>
          <Toaster
            // On mobile, top-right can overlap content. Slide to top-center on small screens.
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#1e293b",
                color: "#f8fafc",
                borderRadius: "10px",
                fontSize: "14px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
                maxWidth: "calc(100vw - 2rem)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#ffffff",
                },
              },
            }}
          />
          {/* Main Top Navbar */}
          <Navbar />

          {/* Marquee Price Ticker right below navbar */}
          <PriceTicker />

          {/* Page content */}
          <div className="flex-1">
            {children}
          </div>

          {/* Main Footer */}
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}