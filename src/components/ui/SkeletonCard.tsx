import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="flex flex-col rounded-2xl bg-white border border-brand-border/60 overflow-hidden animate-pulse shadow-sm">
      <div className="aspect-[3/4] w-full bg-brand-subtle" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-6 bg-gray-200 rounded-full w-14" />
        </div>
      </div>
    </div>
  );
};
