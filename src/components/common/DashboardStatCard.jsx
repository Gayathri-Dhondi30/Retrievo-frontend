import React from 'react';
import { motion } from 'framer-motion';

export const DashboardStatCard = ({ title, value, icon: Icon, subtitle, color = 'caramel' }) => {
  const getColorClasses = () => {
    switch (color) {
      case 'dark':
        return 'bg-gradient-to-br from-brand-dark to-brand-secondary text-white border-brand-dark/40';
      case 'emerald':
        return 'bg-gradient-to-br from-emerald-950 to-emerald-900 text-white border-emerald-800';
      case 'amber':
        return 'bg-gradient-to-br from-amber-900 to-amber-800 text-white border-amber-700';
      case 'caramel':
      default:
        return 'bg-gradient-to-br from-brand-beige to-brand-cream text-brand-dark border-brand-caramel/20';
    }
  };

  const getIconContainer = () => {
    switch (color) {
      case 'dark':
      case 'emerald':
      case 'amber':
        return 'bg-white/10 text-white';
      default:
        return 'bg-brand-caramel/20 text-brand-caramel';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={`p-6 rounded-3xl border shadow-sm flex flex-col justify-between transition-all ${getColorClasses()}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">{title}</span>
        {Icon && (
          <div className={`p-3 rounded-2xl ${getIconContainer()}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">{value}</span>
        {subtitle && <p className="text-xs mt-1 opacity-75">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

export default DashboardStatCard;
