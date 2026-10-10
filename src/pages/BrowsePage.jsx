import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import SearchFilters from '../components/common/SearchFilters';
import ItemGrid from '../components/common/ItemGrid';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';

export const BrowsePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filters, setFilters] = useState({
    keyword: searchParams.get('keyword') || '',
    type: searchParams.get('type') || 'ALL',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    startDate: searchParams.get('startDate') || '',
    status: searchParams.get('status') || '',
    sort: searchParams.get('sort') || 'newest',
    page: parseInt(searchParams.get('page') || '1', 10)
  });

  const [items, setItems] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.keyword) params.append('keyword', filters.keyword);
      if (filters.type && filters.type !== 'ALL') params.append('itemType', filters.type);
      if (filters.category) params.append('category', filters.category);
      if (filters.location) params.append('location', filters.location);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.status) params.append('status', filters.status);
      params.append('sort', filters.sort);
      params.append('page', filters.page - 1);
      params.append('size', 12);

      const res = await api.get(`/items?${params.toString()}`);
      if (res.data) {
        const content = res.data.content || res.data || [];
        setItems(content);
        setTotalPages(res.data.totalPages || 1);
        setTotalItems(res.data.totalElements || content.length);
      }
    } catch (err) {
      console.warn('Could not fetch browse items from backend:', err);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const handleFilterChange = (key, value) => {
    const updated = { ...filters, [key]: value, page: 1 };
    setFilters(updated);

    // Sync search params
    const newParams = new URLSearchParams();
    Object.entries(updated).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
    });
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const initial = {
      keyword: '',
      type: 'ALL',
      category: '',
      location: '',
      startDate: '',
      status: '',
      sort: 'newest',
      page: 1
    };
    setFilters(initial);
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-brand-dark">Browse Lost & Found Directory</h1>
        <p className="text-sm text-brand-muted mt-1">
          Search reported items across campuses, hostels, offices, and venues.
        </p>
      </div>

      {/* Filters Component */}
      <SearchFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
      />

      {/* Results Meta */}
      <div className="flex items-center justify-between text-xs text-brand-muted">
        <span>
          Showing <strong className="text-brand-dark">{items.length}</strong> of{' '}
          <strong className="text-brand-dark">{totalItems}</strong> items
        </span>
      </div>

      {/* Item Grid / State */}
      {loading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : items.length > 0 ? (
        <div className="space-y-8">
          <ItemGrid items={items} />
          <Pagination
            currentPage={filters.page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      ) : (
        <EmptyState
          title="No items match your search"
          description="Try broadening your search keywords or clearing applied filters."
          actionLabel="Clear Filters"
          onActionClick={handleResetFilters}
        />
      )}
    </div>
  );
};

export default BrowsePage;
