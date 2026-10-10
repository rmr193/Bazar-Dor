import HeroBanner from "@/components/HeroBanner";
import MarketTrends from "@/components/MarketTrends";
import AllProductsSection from "@/components/AllProductsSection";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 2. Hero / Banner Section with anchor CTA */}
      <HeroBanner />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
        {/* 3. Section A & B: Market Trends (Top Risers & Fallers) */}
        <MarketTrends />

        {/* 3. Section C: All Products Grid with Category Tabs & Search */}
        <AllProductsSection />
      </div>
    </main>
  );
}
