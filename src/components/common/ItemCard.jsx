import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Tag, ArrowUpRight, Image as ImageIcon } from 'lucide-react';
import StatusBadge from './StatusBadge';

export const ItemCard = ({ item }) => {
  const isLost = item.itemType === 'LOST' || item.type === 'LOST';
  
  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Image URL helper
  const getImageUrl = () => {
    if (item.images && item.images.length > 0) {
      const img = item.images[0];
      return img.imageUrl || img.filePath || `/uploads/${img.fileName}`;
    }
    if (item.imageUrl) return item.imageUrl;
    return null;
  };

  const imageSrc = getImageUrl();

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="group bg-brand-cream border border-brand-caramel/20 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      {/* Image & Badges */}
      <div className="relative aspect-4/3 overflow-hidden bg-brand-beige/60">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={item.title || item.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}

        <div
          className={`w-full h-full items-center justify-center bg-gradient-to-br from-brand-beige to-brand-caramel/20 text-brand-muted ${
            imageSrc ? 'hidden' : 'flex'
          }`}
        >
          <div className="flex flex-col items-center gap-1.5 p-4 text-center">
            <ImageIcon className="w-8 h-8 opacity-40 text-brand-caramel" />
            <span className="text-xs font-semibold text-brand-muted">No Image Attached</span>
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          <span
            className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
              isLost
                ? 'bg-rose-600 text-white border border-rose-700'
                : 'bg-emerald-600 text-white border border-emerald-700'
            }`}
          >
            {isLost ? 'LOST' : 'FOUND'}
          </span>
          <div className="pointer-events-auto">
            <StatusBadge status={item.status} />
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-brand-caramel uppercase tracking-wider mb-2">
          <Tag className="w-3.5 h-3.5" />
          <span>{item.category || 'General'}</span>
        </div>

        <h3 className="font-bold text-lg text-brand-dark group-hover:text-brand-caramel transition-colors line-clamp-1 mb-2">
          {item.title || item.name}
        </h3>

        <p className="text-xs text-brand-muted line-clamp-2 leading-relaxed mb-4 flex-grow">
          {item.description || 'No detailed description provided.'}
        </p>

        {/* Meta details */}
        <div className="space-y-1.5 pt-3 border-t border-brand-caramel/10 text-xs text-brand-muted">
          <div className="flex items-center gap-2 truncate">
            <MapPin className="w-3.5 h-3.5 text-brand-caramel flex-shrink-0" />
            <span className="truncate">{item.location || 'Location unspecified'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-brand-caramel flex-shrink-0" />
            <span>{isLost ? 'Lost on' : 'Found on'}: {formatDate(item.dateLostOrFound || item.date)}</span>
          </div>
        </div>

        {/* Action button */}
        <div className="mt-4 pt-3 border-t border-brand-beige flex items-center justify-between text-xs font-bold text-brand-dark group-hover:text-brand-caramel">
          <span>View Details</span>
          <Link
            to={`/items/${item.id}`}
            aria-label={`View details for ${item.title || item.name}`}
            className="w-8 h-8 rounded-full bg-brand-beige flex items-center justify-center group-hover:bg-brand-caramel group-hover:text-white transition-all shadow-xs"
          >
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ItemCard;
