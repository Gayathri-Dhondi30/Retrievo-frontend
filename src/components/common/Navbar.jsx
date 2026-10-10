import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  PlusCircle,
  User,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  MessageSquare,
  Package,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import NotificationBell from './NotificationBell';

export const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-brand-cream/90 backdrop-blur-md border-b border-brand-caramel/15 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Wordmark */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-hidden">
            <motion.div
              whileHover={{ rotate: [0, -5, 5, 0] }}
              transition={{ duration: 0.5 }}
              className="w-10 h-10 rounded-xl bg-brand-dark p-2 shadow-md flex items-center justify-center"
            >
              <img src="/logo.svg" alt="Retrievo Logo" className="w-full h-full object-contain" />
            </motion.div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-brand-dark group-hover:text-brand-caramel transition-colors">
                Retrievo
              </span>
              <span className="text-[10px] uppercase tracking-widest font-semibold text-brand-muted">
                Smart Lost & Found
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 font-medium text-sm">
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/') ? 'bg-brand-beige text-brand-dark font-semibold' : 'text-brand-muted hover:text-brand-dark hover:bg-brand-beige/50'
              }`}
            >
              Home
            </Link>
            <Link
              to="/browse"
              className={`px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
                isActive('/browse') ? 'bg-brand-beige text-brand-dark font-semibold' : 'text-brand-muted hover:text-brand-dark hover:bg-brand-beige/50'
              }`}
            >
              <Search className="w-4 h-4 text-brand-caramel" />
              Browse Items
            </Link>
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/about') ? 'bg-brand-beige text-brand-dark font-semibold' : 'text-brand-muted hover:text-brand-dark hover:bg-brand-beige/50'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/help"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/help') ? 'bg-brand-beige text-brand-dark font-semibold' : 'text-brand-muted hover:text-brand-dark hover:bg-brand-beige/50'
              }`}
            >
              Help & FAQ
            </Link>
          </nav>

          {/* Action CTAs and User Area */}
          <div className="hidden md:flex items-center gap-3">
            {/* Report CTA */}
            <div className="relative group">
              <Link
                to={isAuthenticated ? "/report/lost" : "/login"}
                className="px-4 py-2.5 rounded-xl bg-brand-caramel text-white font-semibold text-sm shadow-md hover:bg-brand-secondary hover:shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                Report Item
              </Link>
            </div>

            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <NotificationBell />

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 pr-3 rounded-xl border border-brand-caramel/20 hover:bg-brand-beige/60 transition-colors focus:outline-hidden"
                  >
                    <div className="w-8 h-8 rounded-lg bg-brand-dark text-brand-cream font-bold text-sm flex items-center justify-center shadow-xs">
                      {user?.fullName?.charAt(0) || 'U'}
                    </div>
                    <span className="text-xs font-semibold text-brand-dark max-w-24 truncate">
                      {user?.fullName?.split(' ')[0]}
                    </span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 bg-brand-cream border border-brand-caramel/20 rounded-2xl shadow-xl z-50 py-2 divide-y divide-brand-beige"
                      >
                        <div className="px-4 py-2.5">
                          <p className="text-xs text-brand-muted">Signed in as</p>
                          <p className="text-sm font-bold text-brand-dark truncate">{user?.fullName}</p>
                          <p className="text-xs text-brand-muted truncate">{user?.email}</p>
                        </div>

                        <div className="py-1">
                          <Link
                            to="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-main hover:bg-brand-beige transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 text-brand-caramel" />
                            Dashboard
                          </Link>
                          <Link
                            to="/dashboard/my-items"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-main hover:bg-brand-beige transition-colors"
                          >
                            <Package className="w-4 h-4 text-brand-caramel" />
                            My Items
                          </Link>
                          <Link
                            to="/dashboard/messages"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-brand-main hover:bg-brand-beige transition-colors"
                          >
                            <MessageSquare className="w-4 h-4 text-brand-caramel" />
                            Messages
                          </Link>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserMenuOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors"
                            >
                              <ShieldAlert className="w-4 h-4 text-amber-600" />
                              Admin Portal
                            </Link>
                          )}
                        </div>

                        <div className="py-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-brand-dark hover:bg-brand-beige transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl border border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white text-xs font-semibold transition-all shadow-xs"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-2">
            {isAuthenticated && <NotificationBell />}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-brand-dark hover:bg-brand-beige focus:outline-hidden"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-brand-caramel/15 bg-brand-cream px-4 pt-3 pb-6 space-y-3 shadow-xl overflow-hidden"
          >
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-beige"
            >
              Home
            </Link>
            <Link
              to="/browse"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-beige"
            >
              Browse Items
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-beige"
            >
              How It Works
            </Link>
            <Link
              to="/help"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-beige"
            >
              Help & FAQ
            </Link>

            <div className="pt-2 border-t border-brand-beige flex flex-col gap-2">
              <Link
                to={isAuthenticated ? "/report/lost" : "/login"}
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl bg-brand-caramel text-white font-semibold text-sm shadow-sm"
              >
                + Report Item
              </Link>
              {isAuthenticated ? (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-brand-dark hover:bg-brand-beige"
                  >
                    <LayoutDashboard className="w-4 h-4 text-brand-caramel" />
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold text-amber-900 bg-amber-100"
                    >
                      <ShieldAlert className="w-4 h-4 text-amber-700" />
                      Admin Control
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-xl bg-brand-beige text-brand-dark font-semibold text-sm"
                  >
                    Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2 rounded-xl bg-brand-dark text-white font-semibold text-sm"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
