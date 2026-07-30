import React from "react";

export default function LoadingAluno() {
  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8 animate-pulse">
      {/* Banner Skeleton */}
      <div className="h-32 bg-slate-900 border border-slate-800 rounded-3xl w-full" />
      
      {/* 3 Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-48 bg-slate-900 border border-slate-800 rounded-2xl" />
        <div className="h-48 bg-slate-900 border border-slate-800 rounded-2xl" />
        <div className="h-48 bg-slate-900 border border-slate-800 rounded-2xl" />
      </div>

      <div className="h-64 bg-slate-900 border border-slate-800 rounded-2xl w-full" />
    </div>
  );
}
