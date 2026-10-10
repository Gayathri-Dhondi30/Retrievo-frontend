import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-10 max-w-md w-full shadow-xl space-y-6">
        <span className="text-6xl font-extrabold text-brand-caramel">404</span>
        <div>
          <h1 className="text-2xl font-bold text-brand-dark">Page Not Found</h1>
          <p className="text-xs text-brand-muted mt-1 leading-relaxed">
            The page you are looking for doesn’t exist or has been moved.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-dark text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Go to Home
          </Link>
          <Link
            to="/browse"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-beige text-brand-dark font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Browse Items
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
