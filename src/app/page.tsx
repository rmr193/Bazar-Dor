import HeroBanner from "@/components/HeroBanner";
import MarketTrends from "@/components/MarketTrends";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 2. Hero / Banner Section */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 3. Section A & B: Market Trends (Top Risers & Fallers) */}
        <MarketTrends />

        {/* Target anchor section for #সব-পণ্য (Will be filled in Step 7) */}
        <div id="সব-পণ্য" className="py-12 border-t border-slate-200 scroll-mt-24">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              সব পণ্য
            </h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">
              দৈনন্দিন বাজারের সকল নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ মূল্য তালিকা
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
