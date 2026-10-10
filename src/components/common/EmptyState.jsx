import React from 'react';
import { motion } from 'framer-motion';
import { PackageSearch, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const EmptyState = ({
  title = 'No items found',
  description = 'We couldn’t find any matching lost or found item reports.',
  actionLabel,
  actionLink,
  onActionClick
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-xs my-8"
    >
      <div className="w-16 h-16 rounded-2xl bg-brand-beige text-brand-caramel mx-auto flex items-center justify-center mb-4 shadow-inner">
        <PackageSearch className="w-8 h-8 opacity-80" />
      </div>
      <h3 className="font-bold text-xl text-brand-dark mb-2">{title}</h3>
      <p className="text-sm text-brand-muted leading-relaxed mb-6">{description}</p>
      
      {actionLabel && (actionLink || onActionClick) && (
        <div>
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-caramel text-white font-semibold text-sm shadow-md hover:bg-brand-secondary transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              {actionLabel}
            </Link>
          ) : (
            <button
              onClick={onActionClick}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-caramel text-white font-semibold text-sm shadow-md hover:bg-brand-secondary transition-all"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default EmptyState;
