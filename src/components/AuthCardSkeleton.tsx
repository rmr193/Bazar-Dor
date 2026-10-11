import React from "react";

export default function AuthCardSkeleton({ isSignup = false }: { isSignup?: boolean }) {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-12 animate-pulse">
      {/* Title skeleton */}
      <div className="flex flex-col items-center mb-6 space-y-2">
        <div className="h-8 w-40 bg-slate-200 rounded-lg"></div>
        <div className="h-3 w-60 bg-slate-200 rounded"></div>
      </div>

      {/* Card skeleton */}
      <div className="w-full max-w-sm sm:max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-4">
        {isSignup && (
          <div className="space-y-1.5">
            <div className="w-12 h-3 bg-slate-200 rounded"></div>
            <div className="w-full h-10 bg-slate-100 rounded-xl"></div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="w-14 h-3 bg-slate-200 rounded"></div>
          <div className="w-full h-10 bg-slate-100 rounded-xl"></div>
        </div>

        <div className="space-y-1.5">
          <div className="w-16 h-3 bg-slate-200 rounded"></div>
          <div className="w-full h-10 bg-slate-100 rounded-xl"></div>
        </div>

        {isSignup && (
          <div className="space-y-1.5">
            <div className="w-24 h-3 bg-slate-200 rounded"></div>
            <div className="w-full h-10 bg-slate-100 rounded-xl"></div>
          </div>
        )}

        <div className="w-full h-10 bg-emerald-200 rounded-xl mt-3"></div>

        <div className="w-full h-px bg-slate-100 my-4"></div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-9 bg-slate-100 rounded-xl border border-slate-200"></div>
          <div className="h-9 bg-slate-100 rounded-xl border border-slate-200"></div>
        </div>

        <div className="h-4 w-36 mx-auto bg-slate-100 rounded mt-4"></div>
      </div>
    </main>
  );
}
