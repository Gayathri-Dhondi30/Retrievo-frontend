import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export const ToastNotifications = () => {
  const { toasts, removeToast } = useNotification();

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-brand-caramel flex-shrink-0" />;
    }
  };

  const getBorder = (type) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500 bg-emerald-50/90 text-emerald-950';
      case 'error':
        return 'border-rose-500 bg-rose-50/90 text-rose-950';
      default:
        return 'border-brand-caramel bg-brand-cream/95 text-brand-main';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 50, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-xl border shadow-lg backdrop-blur-sm ${getBorder(
              toast.type
            )}`}
          >
            <div className="flex items-center gap-3 pr-2">
              {getIcon(toast.type)}
              <p className="text-sm font-medium leading-snug">{toast.message}</p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-brand-muted hover:text-brand-main p-1 rounded-lg transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastNotifications;
