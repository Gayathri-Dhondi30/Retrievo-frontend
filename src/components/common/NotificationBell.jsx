import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCheck, ExternalLink, Inbox } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';

export const NotificationBell = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }
    setIsOpen(false);
    if (notification.targetUrl) {
      navigate(notification.targetUrl);
    } else {
      navigate('/dashboard/notifications');
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-brand-dark hover:bg-brand-beige/70 transition-colors focus:outline-hidden"
        aria-label="View notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 text-[10px] font-bold text-white bg-rose-600 rounded-full shadow-xs"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-brand-cream border border-brand-caramel/20 rounded-2xl shadow-xl z-50 overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 bg-brand-beige/50 border-b border-brand-caramel/10">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-brand-dark text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 text-xs font-semibold bg-brand-caramel/20 text-brand-dark rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs font-medium text-brand-caramel hover:text-brand-dark flex items-center gap-1 transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto divide-y divide-brand-beige/60">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-brand-muted px-4">
                  <Inbox className="w-8 h-8 mx-auto mb-2 opacity-50 text-brand-caramel" />
                  <p className="text-sm font-medium">No notifications yet</p>
                  <p className="text-xs text-brand-muted mt-1">You'll receive alerts here when item updates occur.</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`p-3.5 hover:bg-brand-beige/40 cursor-pointer transition-colors ${
                      !n.isRead ? 'bg-brand-caramel/5 font-medium' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold text-brand-dark leading-tight">{n.title}</p>
                      <span className="text-[10px] text-brand-muted whitespace-nowrap">
                        {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </span>
                    </div>
                    <p className="text-xs text-brand-muted mt-1 line-clamp-2">{n.message}</p>
                  </div>
                ))
              )}
            </div>

            <div className="p-3 bg-brand-beige/30 border-t border-brand-caramel/10 text-center">
              <Link
                to="/dashboard/notifications"
                onClick={() => setIsOpen(false)}
                className="text-xs font-semibold text-brand-dark hover:text-brand-caramel inline-flex items-center gap-1 transition-colors"
              >
                View all notifications <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
