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

  // Contextual high-quality images by category & keywords
  const CATEGORY_DEFAULT_IMAGES = {
    'Electronics': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    'Wallets and Money': 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80',
    'Keys': 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80',
    'Bags and Backpacks': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    'Clothing & Accessories': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
    'Documents & IDs': 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    'Books & Stationery': 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    'Jewelry & Watches': 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80',
    'Sports Equipment': 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80'
  };

  // Image URL helper
  const getImageUrl = () => {
    if (item.images && item.images.length > 0) {
      const img = item.images[0];
      return img.imageUrl || img.filePath || `/uploads/${img.fileName}`;
    }
    if (item.imageUrl) return item.imageUrl;

    const titleLower = (item.title || item.name || '').toLowerCase();
    if (titleLower.includes('wallet')) return 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('sleeve')) return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('macbook') || titleLower.includes('laptop')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('phone') || titleLower.includes('iphone')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('key')) return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('bag') || titleLower.includes('backpack')) return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80';

    return CATEGORY_DEFAULT_IMAGES[item.category] || null;
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
