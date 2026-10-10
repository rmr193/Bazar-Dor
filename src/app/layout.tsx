import type { Metadata } from "next";
import { Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-hind-siliguri",
});

export const metadata: Metadata = {
  title: "বাজার দর - দৈনন্দিন পণ্যের সঠিক বাজার মূল্য",
  description: "বাংলাদেশের বিভিন্ন বাজারের নিত্যপ্রয়োজনীয় পণ্যের আজকের সর্বশেষ দাম ও বাজারদর এক নজরে জানুন।",
  keywords: ["বাজার দর", "Bazar Dor", "নিত্যপ্রয়োজনীয় পণ্যের দাম", "চাল", "ডাল", "তেল", "সবজি", "বাংলাদেশ বাজার দর"],
  authors: [{ name: "Bazar Dor Team" }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn" className={hindSiliguri.variable}>
      <body className="min-h-screen flex flex-col font-bengali">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#1e293b",
              color: "#f8fafc",
              borderRadius: "10px",
              fontSize: "14px",
              fontFamily: "var(--font-hind-siliguri)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
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
        {children}
      </body>
    </html>
  );
}
