import React from 'react';
import { Search, Filter, RotateCcw, Calendar, MapPin, Tag } from 'lucide-react';

export const CATEGORIES = [
  'Electronics',
  'Wallets and Money',
  'Bags',
  'Books and Documents',
  'Keys',
  'Clothing',
  'Jewellery',
  'ID Cards',
  'Accessories',
  'Other'
];

export const STATUSES = ['OPEN', 'MATCHED', 'CLAIM_PENDING', 'RECOVERED', 'CLOSED'];

export const SearchFilters = ({ filters, onFilterChange, onResetFilters }) => {
  return (
    <div className="bg-brand-cream border border-brand-caramel/20 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top Row: Search Input & Type Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-grow">
          <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-caramel" />
          <input
            type="text"
            placeholder="Search by title, description, or keyword..."
            value={filters.keyword || ''}
            onChange={(e) => onFilterChange('keyword', e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-brand-caramel/25 bg-brand-beige/40 text-brand-dark placeholder:text-brand-muted text-sm focus:outline-hidden focus:border-brand-caramel focus:ring-2 focus:ring-brand-caramel/20 transition-all"
          />
        </div>

        {/* Type Toggle: All, Lost, Found */}
        <div className="flex items-center bg-brand-beige/80 p-1 rounded-xl border border-brand-caramel/20 self-start md:self-auto">
          {['ALL', 'LOST', 'FOUND'].map((type) => (
            <button
              key={type}
              onClick={() => onFilterChange('type', type)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                (filters.type || 'ALL') === type
                  ? 'bg-brand-dark text-white shadow-xs'
                  : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              {type === 'ALL' ? 'All Items' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Options Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-3 border-t border-brand-caramel/15">
        {/* Category Dropdown */}
        <div>
          <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 flex items-center gap-1">
            <Tag className="w-3 h-3 text-brand-caramel" /> Category
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => onFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-brand-caramel/20 bg-brand-beige/30 text-brand-dark text-xs focus:outline-hidden focus:border-brand-caramel"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-caramel" /> Location
          </label>
          <input
            type="text"
            placeholder="e.g. Library, Hostel A"
            value={filters.location || ''}
            onChange={(e) => onFilterChange('location', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-brand-caramel/20 bg-brand-beige/30 text-brand-dark text-xs focus:outline-hidden focus:border-brand-caramel"
          />
        </div>

        {/* Date Filter */}
        <div>
          <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-brand-caramel" /> From Date
          </label>
          <input
            type="date"
            value={filters.startDate || ''}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-brand-caramel/20 bg-brand-beige/30 text-brand-dark text-xs focus:outline-hidden focus:border-brand-caramel"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 flex items-center gap-1">
            <Filter className="w-3 h-3 text-brand-caramel" /> Status
          </label>
          <select
            value={filters.status || ''}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-brand-caramel/20 bg-brand-beige/30 text-brand-dark text-xs focus:outline-hidden focus:border-brand-caramel"
          >
            <option value="">All Statuses</option>
            {STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div>
          <label className="block text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1">
            Sort By
          </label>
          <select
            value={filters.sort || 'newest'}
            onChange={(e) => onFilterChange('sort', e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-brand-caramel/20 bg-brand-beige/30 text-brand-dark text-xs focus:outline-hidden focus:border-brand-caramel"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Clear Filters CTA */}
      <div className="flex items-center justify-between text-xs pt-1">
        <span className="text-brand-muted">
          Active filters: <strong className="text-brand-dark">{Object.values(filters).filter(Boolean).length}</strong>
        </span>
        <button
          onClick={onResetFilters}
          className="text-brand-caramel hover:text-brand-dark font-semibold flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;
