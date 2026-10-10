import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  PlusCircle,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  BellRing,
  Award,
  CheckCircle2,
  Users,
  PackageCheck,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import api from '../api/axios';
import ItemGrid from '../components/common/ItemGrid';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export const LandingPage = () => {
  const [recentLost, setRecentLost] = useState([]);
  const [recentFound, setRecentFound] = useState([]);
  const [stats, setStats] = useState({
    totalReports: 0,
    foundCount: 0,
    recoveredCount: 0,
    activeUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('ALL');

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        setLoading(true);
        // Fetch recent items from API
        const [itemsRes, statsRes] = await Promise.allSettled([
          api.get('/items?size=8&sort=newest'),
          api.get('/dashboard/summary')
        ]);

        if (itemsRes.status === 'fulfilled' && itemsRes.value.data) {
          const items = itemsRes.value.data.content || itemsRes.value.data || [];
          setRecentLost(items.filter((i) => (i.itemType || i.type) === 'LOST'));
          setRecentFound(items.filter((i) => (i.itemType || i.type) === 'FOUND'));
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.data) {
          setStats({
            totalReports: statsRes.value.data.totalReports || 0,
            foundCount: statsRes.value.data.foundCount || 0,
            recoveredCount: statsRes.value.data.recoveredCount || 0,
            activeUsers: statsRes.value.data.activeUsers || 0
          });
        }
      } catch (e) {
        console.warn('Backend API connection pending:', e);
      } finally {
        setLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  const allRecentItems = [...recentLost, ...recentFound].slice(0, 8);
  const displayItems =
    activeTab === 'LOST'
      ? recentLost
      : activeTab === 'FOUND'
      ? recentFound
      : allRecentItems;

  return (
    <div className="space-y-20 pb-16">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-gradient-to-b from-brand-beige/50 to-brand-cream">
        {/* Subtle Background Decorative Shapes */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
          <motion.div
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, 0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-0 right-10 w-96 h-96 rounded-full bg-brand-caramel/20 blur-3xl"
          />
          <motion.div
            animate={{ scale: [1, 1.08, 1], rotate: [0, -3, 0] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-brand-secondary/15 blur-3xl"
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-beige border border-brand-caramel/30 text-brand-dark text-xs font-bold shadow-xs"
              >
                <Sparkles className="w-4 h-4 text-brand-caramel" />
                <span>Next-Gen AI Image Similarity & Recoveries</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark leading-[1.15]"
              >
                Lost Something? <br />
                <span className="text-brand-caramel">Let’s Bring It Back.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Retrievo bridges the gap between lost belongings and honest finders. Using smart visual matching, location tracking, and verified messaging, we reunite items with their rightful owners.
              </motion.p>

              {/* Hero CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  to="/report/lost"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-dark text-white font-bold text-sm shadow-xl hover:bg-brand-secondary transform active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4 text-brand-caramel" />
                  Report Lost Item
                </Link>

                <Link
                  to="/browse"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-brand-beige border border-brand-caramel/30 text-brand-dark font-bold text-sm shadow-sm hover:bg-brand-caramel hover:text-white transform active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Browse Found Directory
                </Link>
              </motion.div>
            </div>

            {/* Hero Visual Card Stack */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="relative mx-auto max-w-md"
              >
                <div className="glass-card rounded-3xl p-6 shadow-2xl space-y-4 border border-brand-caramel/30 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-dark text-white flex items-center justify-center font-bold">
                        AI
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-brand-dark">Match Suggested</h4>
                        <p className="text-[11px] text-brand-muted">Confidence Score: 94%</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold">
                      Match Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-brand-cream p-3 rounded-2xl border border-brand-caramel/20 space-y-1">
                      <span className="text-[10px] font-bold text-rose-600 uppercase">Lost Report</span>
                      <p className="font-bold text-xs text-brand-dark truncate">Black Leather Wallet</p>
                      <p className="text-[10px] text-brand-muted">Library 2nd Floor</p>
                    </div>
                    <div className="bg-brand-cream p-3 rounded-2xl border border-brand-caramel/20 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 uppercase">Found Report</span>
                      <p className="font-bold text-xs text-brand-dark truncate">Leather Card Holder</p>
                      <p className="text-[10px] text-brand-muted">Campus Desk</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 text-brand-dark font-medium border-t border-brand-caramel/15">
                    <span>Private Messaging Active</span>
                    <Link to="/browse" className="text-brand-caramel font-bold hover:underline flex items-center gap-1">
                      View Demo <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

                {/* Floating Badge */}
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -left-6 bg-brand-dark text-brand-cream px-4 py-3 rounded-2xl shadow-xl border border-brand-caramel/30 flex items-center gap-3 z-20"
                >
                  <Award className="w-5 h-5 text-brand-caramel" />
                  <div>
                    <p className="text-xs font-bold">98.5% Verification</p>
                    <p className="text-[10px] text-brand-beige/70">Verified Ownership Claims</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* LIVE DISCOVERY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-caramel mb-1">
              <TrendingUp className="w-4 h-4" /> Live System Feed
            </div>
            <h2 className="text-3xl font-extrabold text-brand-dark">Recently Reported Belongings</h2>
          </div>

          {/* Toggle Tab */}
          <div className="flex items-center bg-brand-beige p-1 rounded-xl border border-brand-caramel/20 self-start">
            <button
              onClick={() => setActiveTab('ALL')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'ALL' ? 'bg-brand-dark text-white shadow-xs' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setActiveTab('LOST')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'LOST' ? 'bg-rose-600 text-white shadow-xs' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              Lost Items
            </button>
            <button
              onClick={() => setActiveTab('FOUND')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'FOUND' ? 'bg-emerald-600 text-white shadow-xs' : 'text-brand-muted hover:text-brand-dark'
              }`}
            >
              Found Items
            </button>
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="card" count={4} />
        ) : displayItems.length > 0 ? (
          <ItemGrid items={displayItems} />
        ) : (
          <div className="bg-brand-beige/30 border border-brand-caramel/20 rounded-3xl p-10 text-center space-y-3">
            <PackageCheck className="w-12 h-12 text-brand-caramel mx-auto opacity-70" />
            <h3 className="font-bold text-lg text-brand-dark">No live records yet</h3>
            <p className="text-xs text-brand-muted max-w-md mx-auto">
              Be the first to create a report! Your submission will appear live in our system.
            </p>
            <Link
              to="/report/lost"
              className="inline-block mt-2 px-5 py-2.5 rounded-xl bg-brand-caramel text-white font-bold text-xs shadow-md hover:bg-brand-secondary"
            >
              Submit First Report
            </Link>
          </div>
        )}

        <div className="text-center pt-4">
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 text-sm font-bold text-brand-dark hover:text-brand-caramel transition-colors"
          >
            Explore Complete Item Directory <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-brand-beige/50 border-y border-brand-caramel/15 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-caramel">Step-By-Step Process</span>
            <h2 className="text-3xl font-extrabold text-brand-dark">How Retrievo Works</h2>
            <p className="text-sm text-brand-muted">
              Four simple steps to recover lost items or return found belongings to their owners safely.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Report Belongings',
                desc: 'Upload item photo, title, category, date, and last seen location details.'
              },
              {
                step: '02',
                title: 'AI Smart Match',
                desc: 'Our similarity engine ranks potential matches by visual and metadata evidence.'
              },
              {
                step: '03',
                title: 'Secure Contact',
                desc: 'Chat privately without disclosing sensitive phone numbers or personal emails.'
              },
              {
                step: '04',
                title: 'Verify & Recover',
                desc: 'Confirm unique identifying details, approve claims, and mark item recovered.'
              }
            ].map((s, idx) => (
              <div
                key={idx}
                className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 relative space-y-3 shadow-xs hover:shadow-md transition-shadow"
              >
                <span className="text-3xl font-extrabold text-brand-caramel/40">{s.step}</span>
                <h3 className="font-bold text-lg text-brand-dark">{s.title}</h3>
                <p className="text-xs text-brand-muted leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES HIGHLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-caramel">Built For Security</span>
          <h2 className="text-3xl font-extrabold text-brand-dark">Core Technology & Features</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Sparkles,
              title: 'Visual Similarity AI',
              desc: 'Advanced image feature matching and embedding score ranking to locate matches even when titles differ.'
            },
            {
              icon: ShieldCheck,
              title: 'Private Ownership Claims',
              desc: 'Claimants submit secret distinguishing details for finder verification before physical handover.'
            },
            {
              icon: MessageSquare,
              title: 'In-App Messaging',
              desc: 'Direct, protected conversation threads between reporters without public contact exposure.'
            },
            {
              icon: BellRing,
              title: 'Real-Time Notifications',
              desc: 'Automated system alerts for candidate matches, chat messages, and status updates.'
            },
            {
              icon: CheckCircle2,
              title: 'Recovery Audit Trail',
              desc: 'Complete lifecycle tracking from Open to Matched, Claimed, and officially Recovered.'
            },
            {
              icon: Users,
              title: 'Admin Moderation',
              desc: 'Role-based access control, spam prevention, abuse reporting, and operational analytics.'
            }
          ].map((f, i) => (
            <div key={i} className="p-6 rounded-3xl bg-brand-cream border border-brand-caramel/20 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-brand-beige text-brand-caramel flex items-center justify-center">
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-brand-dark">{f.title}</h3>
              <p className="text-xs text-brand-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="bg-brand-dark text-brand-cream py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-brand-caramel">{stats.totalReports}</p>
              <p className="text-xs font-bold text-brand-beige/80 mt-1 uppercase tracking-wider">Total Reports</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-brand-caramel">{stats.foundCount}</p>
              <p className="text-xs font-bold text-brand-beige/80 mt-1 uppercase tracking-wider">Found Items</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-brand-caramel">{stats.recoveredCount}</p>
              <p className="text-xs font-bold text-brand-beige/80 mt-1 uppercase tracking-wider">Successful Recoveries</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-brand-caramel">{stats.activeUsers}</p>
              <p className="text-xs font-bold text-brand-beige/80 mt-1 uppercase tracking-wider">Active Users</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
