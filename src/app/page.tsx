import HeroBanner from "@/components/HeroBanner";
import MarketTrends from "@/components/MarketTrends";
import AllProductsSection from "@/components/AllProductsSection";

export default function Home() {
  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 space-y-4">
      {/* Hero / Banner Section */}
      <HeroBanner />

      {/* Section A & B: Market Trends (Top Risers & Fallers) */}
      <MarketTrends />

      {/* Section C: All Products Grid with Category Tabs & Search */}
      <AllProductsSection />
    </main>
  );
}
