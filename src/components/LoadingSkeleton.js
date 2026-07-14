import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="glassmorphism rounded-2xl p-4 w-full animate-pulse border border-slate-100 dark:border-slate-800">
      <div className="h-40 bg-slate-200 dark:bg-slate-850 rounded-xl mb-4" />
      <div className="h-4 bg-slate-200 dark:bg-slate-850 rounded w-2/3 mb-2" />
      <div className="h-3 bg-slate-200 dark:bg-slate-850 rounded w-1/2 mb-4" />
      <div className="flex justify-between items-center">
        <div className="h-5 bg-slate-200 dark:bg-slate-850 rounded w-1/4" />
        <div className="h-8 bg-slate-200 dark:bg-slate-850 rounded-lg w-1/3" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }) {
  return (
    <div className="w-full space-y-4 animate-pulse">
      <div className="h-10 bg-slate-200 dark:bg-slate-850 rounded-lg w-full" />
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <div key={cIdx} className="h-8 bg-slate-200 dark:bg-slate-850 rounded-lg flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}
