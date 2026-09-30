import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm animate-pulse space-y-4">
    <div className="flex justify-between items-center">
      <div className="h-6 w-32 bg-slate-200 rounded"></div>
      <div className="h-5 w-16 bg-slate-200 rounded-full"></div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-full bg-slate-100 rounded"></div>
      <div className="h-4 w-3/4 bg-slate-100 rounded"></div>
    </div>
    <div className="pt-2 flex justify-between items-center border-t border-slate-100">
      <div className="h-4 w-24 bg-slate-200 rounded"></div>
      <div className="h-8 w-20 bg-slate-200 rounded-lg"></div>
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5 }) => (
  <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
    <div className="h-12 bg-slate-100 border-b border-slate-200"></div>
    {Array.from({ length: rows }).map((_, idx) => (
      <div key={idx} className="flex items-center gap-4 p-4 border-b border-slate-100">
        <div className="h-4 w-28 bg-slate-200 rounded"></div>
        <div className="h-4 w-48 bg-slate-200 rounded"></div>
        <div className="h-4 w-32 bg-slate-100 rounded"></div>
        <div className="h-5 w-20 bg-slate-200 rounded-full ml-auto"></div>
      </div>
    ))}
  </div>
);
