import HeroBanner from "@/components/HeroBanner";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* 2. Hero / Banner Section */}
      <HeroBanner />

      {/* Target anchor section for #সব-পণ্য */}
      <div id="সব-পণ্য" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 scroll-mt-24">
        <div className="text-center sm:text-left">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            সব পণ্য
          </h2>
          <p className="text-sm sm:text-base text-slate-500 mt-1">
            দৈনন্দিন বাজারের সকল নিত্যপ্রয়োজনীয় পণ্যের সর্বশেষ মূল্য তালিকা
          </p>
        </div>
      </div>
    </main>
  );
}
