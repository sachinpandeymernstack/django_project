import React from 'react';

export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-800/70 rounded-xl ${className}`} />
);

export const SkeletonCard: React.FC = () => (
  <div className="glass-card p-5 rounded-2xl border border-slate-800/80 space-y-4 animate-pulse">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <Skeleton className="h-10 w-10 rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-6 w-16 rounded-lg" />
    </div>
    <div className="space-y-2 pt-2 border-t border-slate-800/60">
      <Skeleton className="h-3 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  </div>
);

export const SkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonMetric: React.FC = () => (
  <div className="glass-card p-6 rounded-2xl border border-slate-800 flex items-center justify-between animate-pulse">
    <div className="space-y-2">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-28" />
    </div>
    <Skeleton className="h-12 w-12 rounded-2xl" />
  </div>
);
