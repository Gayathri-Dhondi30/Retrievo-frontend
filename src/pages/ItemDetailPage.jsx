import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Calendar,
  Clock,
  Tag,
  ShieldCheck,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Trash2,
  Edit,
  CheckCircle2,
  AlertCircle,
  Share2,
  Lock
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ConfirmationModal from '../components/common/ConfirmationModal';

export const ItemDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useNotification();

  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [proofDescription, setProofDescription] = useState('');
  const [submittingClaim, setSubmittingClaim] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchItemDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/items/${id}`);
      setItem(res.data);

      // Fetch matches for this item if logged in
      try {
        const matchesRes = await api.get(`/matches?itemId=${id}`);
        setMatches(matchesRes.data || []);
      } catch (e) {
        // match fetch optional
      }
    } catch (err) {
      showToast('Item not found or failed to load.', 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchItemDetails();
  }, [fetchItemDetails]);

  const isOwner = user && item && (item.reporterId === user.id || item.reporter?.id === user.id);
  const isLost = item?.itemType === 'LOST' || item?.type === 'LOST';

  const handleStartConversation = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      const res = await api.post('/conversations', { itemId: item.id });
      const conversationId = res.data.id || res.data;
      navigate(`/dashboard/messages?id=${conversationId}`);
    } catch (err) {
      showToast(err.response?.data?.message || 'Could not start conversation.', 'error');
    }
  };

  const handleSubmitClaim = async (e) => {
    e.preventDefault();
    if (!proofDescription.trim()) {
      showToast('Please provide proof of ownership or identifying details.', 'error');
      return;
    }
    try {
      setSubmittingClaim(true);
      await api.post(`/items/${item.id}/claims`, { proofDescription });
      showToast('Ownership claim submitted successfully!', 'success');
      setClaimModalOpen(false);
      setProofDescription('');
      fetchItemDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit claim.', 'error');
    } finally {
      setSubmittingClaim(false);
    }
  };

  const handleDeleteItem = async () => {
    try {
      setDeleting(true);
      await api.delete(`/items/${item.id}`);
      showToast('Report deleted successfully.', 'success');
      navigate('/dashboard/my-items');
    } catch (err) {
      showToast('Failed to delete report.', 'error');
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  };

  const handleMarkRecovered = async () => {
    try {
      await api.post(`/items/${item.id}/confirm-recovery`);
      showToast('Item marked as RECOVERED! Congratulations.', 'success');
      fetchItemDetails();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status.', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <LoadingSkeleton type="detail" />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
        <h2 className="text-2xl font-bold text-brand-dark">Item Not Found</h2>
        <p className="text-xs text-brand-muted">The requested lost or found report does not exist or was removed.</p>
        <Link
          to="/browse"
          className="inline-block px-5 py-2.5 rounded-xl bg-brand-dark text-white font-bold text-xs"
        >
          Return to Browse Directory
        </Link>
      </div>
    );
  }

  const images = item.images || [];
  const getDetailImage = () => {
    if (images.length > 0) {
      return images[0].imageUrl || images[0].filePath || `/uploads/${images[0].fileName}`;
    }
    if (item.imageUrl) return item.imageUrl;
    const titleLower = (item.title || item.name || '').toLowerCase();
    if (titleLower.includes('wallet')) return 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('sleeve')) return 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('macbook') || titleLower.includes('laptop')) return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('phone') || titleLower.includes('iphone')) return 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('key')) return 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80';
    if (titleLower.includes('bag') || titleLower.includes('backpack')) return 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80';
    return 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80';
  };
  const primaryImage = getDetailImage();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-muted hover:text-brand-dark transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Search
      </button>

      {/* Main Grid: Gallery & Information */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-4/3 rounded-3xl overflow-hidden border border-brand-caramel/20 bg-brand-beige/50 shadow-md">
            {primaryImage ? (
              <img src={primaryImage} alt={item.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-brand-muted p-6">
                <Tag className="w-12 h-12 opacity-30 text-brand-caramel mb-2" />
                <p className="text-xs font-bold">No Image Uploaded</p>
                <p className="text-[11px]">Protected metadata report</p>
              </div>
            )}

            <div className="absolute top-4 left-4 flex gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-extrabold shadow-sm ${
                  isLost ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {isLost ? 'LOST REPORT' : 'FOUND REPORT'}
              </span>
              <StatusBadge status={item.status} />
            </div>
          </div>
        </div>

        {/* Right Column: Item Information & Actions */}
        <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-brand-caramel uppercase tracking-wider">
              <Tag className="w-3.5 h-3.5" />
              <span>{item.category || 'General'}</span>
            </div>

            <h1 className="text-3xl font-extrabold text-brand-dark leading-tight">{item.title || item.name}</h1>

            <p className="text-sm text-brand-muted leading-relaxed">{item.description}</p>

            {/* Details Box */}
            <div className="bg-brand-beige/50 border border-brand-caramel/20 rounded-2xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-brand-dark">
                <MapPin className="w-4 h-4 text-brand-caramel flex-shrink-0" />
                <span className="font-bold">{isLost ? 'Last Seen Location:' : 'Found Location:'}</span>
                <span className="text-brand-muted">{item.location}</span>
              </div>
              <div className="flex items-center gap-2 text-brand-dark">
                <Calendar className="w-4 h-4 text-brand-caramel flex-shrink-0" />
                <span className="font-bold">{isLost ? 'Date Lost:' : 'Date Found:'}</span>
                <span className="text-brand-muted">
                  {item.dateLostOrFound ? new Date(item.dateLostOrFound).toLocaleDateString() : 'Not specified'}
                </span>
              </div>
              {item.approximateTime && (
                <div className="flex items-center gap-2 text-brand-dark">
                  <Clock className="w-4 h-4 text-brand-caramel flex-shrink-0" />
                  <span className="font-bold">Approximate Time:</span>
                  <span className="text-brand-muted">{item.approximateTime}</span>
                </div>
              )}
            </div>

            {/* Distinguishing Features */}
            {item.distinguishingFeatures && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs space-y-1">
                <span className="font-bold text-amber-900 flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-amber-700" /> Distinguishing Features:
                </span>
                <p className="text-amber-950 leading-relaxed">{item.distinguishingFeatures}</p>
              </div>
            )}
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-brand-caramel/15 space-y-3">
            {isOwner ? (
              <div className="flex flex-wrap items-center gap-3">
                {item.status !== 'RECOVERED' && (
                  <button
                    onClick={handleMarkRecovered}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md hover:bg-emerald-700 flex items-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark as Recovered
                  </button>
                )}
                <button
                  onClick={() => setDeleteModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl border border-rose-300 text-rose-700 hover:bg-rose-50 font-bold text-xs flex items-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Report
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Finder or Lost Owner CTA */}
                {!isLost && item.status === 'OPEN' && (
                  <button
                    onClick={() => {
                      if (!isAuthenticated) navigate('/login');
                      else setClaimModalOpen(true);
                    }}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-caramel text-white font-bold text-xs shadow-md hover:bg-brand-secondary flex items-center justify-center gap-2 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Claim This Item
                  </button>
                )}

                <button
                  onClick={handleStartConversation}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-dark text-white font-bold text-xs shadow-md hover:bg-brand-secondary flex items-center justify-center gap-2 transition-all"
                >
                  <MessageSquare className="w-4 h-4 text-brand-caramel" />
                  Message Reporter Privately
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-[11px] text-brand-muted pt-2">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-caramel" />
              <span>Personal contact details remain protected until ownership is verified.</span>
            </div>
          </div>

        </div>

      </div>

      {/* AI SUGGESTED MATCHES SECTION */}
      {matches.length > 0 && (
        <section className="pt-10 border-t border-brand-caramel/20 space-y-6">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-caramel" />
            <h2 className="text-xl font-bold text-brand-dark">AI Suggested Matches for this Item</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((m) => {
              const matchedItem = m.lostItemId === item.id ? m.foundItem : m.lostItem;
              if (!matchedItem) return null;
              const matchScore = Math.round((m.overallScore || 0) * 100);

              return (
                <div
                  key={m.id}
                  className="bg-brand-cream border border-brand-caramel/20 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-xs hover:border-brand-caramel transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-brand-caramel/20 text-brand-dark font-bold text-[10px]">
                        {matchScore}% Match Score
                      </span>
                      <span className="text-[11px] font-bold text-brand-muted uppercase">{matchedItem.category}</span>
                    </div>
                    <h4 className="font-bold text-sm text-brand-dark">{matchedItem.title || matchedItem.name}</h4>
                    <p className="text-xs text-brand-muted truncate max-w-xs">{matchedItem.location}</p>
                  </div>

                  <Link
                    to={`/items/${matchedItem.id}`}
                    className="px-3 py-1.5 rounded-xl bg-brand-beige text-brand-dark font-bold text-xs hover:bg-brand-dark hover:text-white transition-colors"
                  >
                    Compare
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Claim Modal */}
      {claimModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-xs" onClick={() => setClaimModalOpen(false)} />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 max-w-md w-full z-10 space-y-4 shadow-2xl"
          >
            <h3 className="font-bold text-lg text-brand-dark">Submit Ownership Claim</h3>
            <p className="text-xs text-brand-muted leading-relaxed">
              Describe identifying details only the true owner would know (e.g. wallpapers, engravings, serial numbers, pouch contents).
            </p>

            <form onSubmit={handleSubmitClaim} className="space-y-4">
              <textarea
                rows={4}
                required
                placeholder="Enter secret distinguishing proof details..."
                value={proofDescription}
                onChange={(e) => setProofDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-brand-caramel/30 bg-white text-xs text-brand-dark focus:outline-hidden focus:border-brand-caramel"
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setClaimModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-brand-beige text-brand-dark"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingClaim}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-brand-caramel text-white shadow-md hover:bg-brand-secondary"
                >
                  {submittingClaim ? 'Submitting...' : 'Submit Ownership Claim'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteItem}
        title="Delete Item Report"
        message="Are you sure you want to permanently delete this report? This cannot be undone."
        isDanger={true}
        loading={deleting}
      />

    </div>
  );
};

export default ItemDetailPage;
