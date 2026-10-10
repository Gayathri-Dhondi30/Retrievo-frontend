import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({ currentPage = 1, totalPages = 1, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between pt-6 border-t border-brand-caramel/15">
      <p className="text-xs font-medium text-brand-muted">
        Page <span className="font-bold text-brand-dark">{currentPage}</span> of{' '}
        <span className="font-bold text-brand-dark">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-xl border border-brand-caramel/20 bg-brand-cream text-brand-dark hover:bg-brand-beige disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: totalPages }).map((_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                  currentPage === pageNum
                    ? 'bg-brand-dark text-white shadow-xs'
                    : 'bg-brand-cream border border-brand-caramel/20 text-brand-dark hover:bg-brand-beige'
                }`}
              >
                {pageNum}
              </button>
            );
          } else if (
            (pageNum === 2 && currentPage > 3) ||
            (pageNum === totalPages - 1 && currentPage < totalPages - 2)
          ) {
            return (
              <span key={pageNum} className="text-xs text-brand-muted px-1">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl border border-brand-caramel/20 bg-brand-cream text-brand-dark hover:bg-brand-beige disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
