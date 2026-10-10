import React from 'react';

export const LoadingSkeleton = ({ type = 'card', count = 3 }) => {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-brand-beige/50 border border-brand-caramel/10 rounded-2xl p-5 space-y-4 animate-pulse"
          >
            <div className="w-full aspect-4/3 bg-brand-caramel/15 rounded-xl" />
            <div className="h-4 bg-brand-caramel/20 rounded-md w-1/3" />
            <div className="h-6 bg-brand-caramel/25 rounded-md w-3/4" />
            <div className="space-y-2">
              <div className="h-3 bg-brand-caramel/15 rounded-md w-full" />
              <div className="h-3 bg-brand-caramel/15 rounded-md w-2/3" />
            </div>
            <div className="pt-3 border-t border-brand-caramel/10 flex justify-between">
              <div className="h-4 bg-brand-caramel/15 rounded-md w-1/4" />
              <div className="h-4 bg-brand-caramel/20 rounded-md w-1/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-3">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-brand-beige/40 border border-brand-caramel/10 rounded-xl p-4 flex items-center justify-between animate-pulse"
          >
            <div className="flex items-center gap-4 w-2/3">
              <div className="w-12 h-12 rounded-lg bg-brand-caramel/20 flex-shrink-0" />
              <div className="space-y-2 w-full">
                <div className="h-4 bg-brand-caramel/25 rounded-md w-1/2" />
                <div className="h-3 bg-brand-caramel/15 rounded-md w-3/4" />
              </div>
            </div>
            <div className="h-8 w-20 bg-brand-caramel/20 rounded-lg" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-pulse">
      <div className="h-8 bg-brand-caramel/20 rounded-md w-1/3" />
      <div className="h-32 bg-brand-caramel/15 rounded-xl w-full" />
    </div>
  );
};

export default LoadingSkeleton;
