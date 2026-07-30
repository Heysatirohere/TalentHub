import React from "react";

export default function LoadingMaster() {
  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8 animate-pulse">
      <div className="h-28 bg-slate-900 border border-slate-800 rounded-3xl w-full" />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl" />
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl" />
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl" />
        <div className="h-28 bg-slate-900 border border-slate-800 rounded-2xl" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 h-80 bg-slate-900 border border-slate-800 rounded-3xl" />
        <div className="lg:col-span-5 h-80 bg-slate-900 border border-slate-800 rounded-3xl" />
      </div>
    </div>
  );
}
