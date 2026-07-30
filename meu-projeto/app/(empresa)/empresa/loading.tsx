import React from "react";

export default function LoadingEmpresa() {
  return (
    <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8 animate-pulse">
      <div className="h-32 bg-slate-900 border border-slate-800 rounded-3xl w-full" />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-56 bg-slate-900 border border-slate-800 rounded-3xl" />
        <div className="h-56 bg-slate-900 border border-slate-800 rounded-3xl" />
        <div className="h-56 bg-slate-900 border border-slate-800 rounded-3xl" />
      </div>

      <div className="h-64 bg-slate-900 border border-slate-800 rounded-3xl w-full" />
    </div>
  );
}
