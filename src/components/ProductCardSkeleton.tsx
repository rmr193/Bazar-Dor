import React from "react";

// Simple skeleton card to show while fetching products
export default function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs animate-pulse flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 bg-slate-200 rounded-xl"></div>
          <div className="w-12 h-5 bg-slate-200 rounded"></div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="w-3/4 h-5 bg-slate-200 rounded"></div>
          <div className="w-1/3 h-3 bg-slate-200 rounded"></div>
        </div>
      </div>
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-end justify-between">
        <div className="space-y-1">
          <div className="w-12 h-3 bg-slate-200 rounded"></div>
          <div className="w-20 h-6 bg-slate-200 rounded"></div>
        </div>
        <div className="w-16 h-6 bg-slate-200 rounded"></div>
      </div>
    </div>
  );
}
