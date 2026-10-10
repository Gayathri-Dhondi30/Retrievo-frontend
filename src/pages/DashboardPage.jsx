import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Bell,
  User,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  Trash2
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import DashboardStatCard from '../components/common/DashboardStatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import EmptyState from '../components/common/EmptyState';
import FormField from '../components/common/FormField';

export const DashboardPage = ({ initialTab = 'overview' }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || initialTab;
  const conversationIdParam = searchParams.get('id');

  const { user, updateProfile } = useAuth();
  const { showToast } = useNotification();

  const [stats, setStats] = useState(null);
  const [myItems, setMyItems] = useState([]);
  const [matches, setMatches] = useState([]);
  const [claims, setClaims] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, itemsRes, matchesRes, claimsRes, convsRes] = await Promise.allSettled([
        api.get('/dashboard/summary'),
        api.get('/items/my-items'),
        api.get('/matches/my-matches'),
        api.get('/claims'),
        api.get('/conversations')
      ]);

      if (summaryRes.status === 'fulfilled') setStats(summaryRes.value.data);
      if (itemsRes.status === 'fulfilled') setMyItems(itemsRes.value.data || []);
      if (matchesRes.status === 'fulfilled') setMatches(matchesRes.value.data || []);
      if (claimsRes.status === 'fulfilled') setClaims(claimsRes.value.data || []);
      if (convsRes.status === 'fulfilled') {
        const convList = convsRes.value.data || [];
        setConversations(convList);

        // Auto select specified conversation
        if (conversationIdParam) {
          const matchConv = convList.find((c) => String(c.id) === String(conversationIdParam));
          if (matchConv) setSelectedConversation(matchConv);
        } else if (convList.length > 0 && !selectedConversation) {
          setSelectedConversation(convList[0]);
        }
      }
    } catch (e) {
      console.warn('Dashboard fetch error:', e);
    } finally {
      setLoading(false);
    }
  }, [conversationIdParam]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Fetch messages when selectedConversation changes
  useEffect(() => {
    if (selectedConversation) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`/conversations/${selectedConversation.id}/messages`);
          setMessages(res.data || []);
        } catch (e) {
          console.warn('Could not fetch messages:', e);
        }
      };
      fetchMessages();
    }
  }, [selectedConversation]);

  const handleTabChange = (tab) => {
    setSearchParams({ tab });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !selectedConversation) return;

    try {
      const res = await api.post(`/conversations/${selectedConversation.id}/messages`, {
        content: newMessageText
      });
      setMessages((prev) => [...prev, res.data]);
      setNewMessageText('');
    } catch (err) {
      showToast('Failed to send message.', 'error');
    }
  };

  const handleClaimStatusUpdate = async (claimId, status) => {
    try {
      await api.patch(`/claims/${claimId}`, { status });
      showToast(`Claim ${status.toLowerCase()} successfully!`, 'success');
      fetchDashboardData();
    } catch (err) {
      showToast('Failed to update claim status.', 'error');
    }
  };

  const handleMatchAction = async (matchId, action) => {
    try {
      await api.post(`/matches/${matchId}/${action}`);
      showToast(`Match ${action}ed!`, 'success');
      fetchDashboardData();
    } catch (err) {
      showToast(`Failed to ${action} match.`, 'error');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSavingProfile(true);
      const res = await updateProfile(profileForm);
      if (res.success) {
        showToast('Profile updated successfully!', 'success');
      } else {
        showToast(res.message, 'error');
      }
    } catch (e) {
      showToast('Profile update failed.', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Welcome Bar */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-secondary text-brand-cream rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-caramel">Authenticated Portal</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, {user?.fullName}!</h1>
          <p className="text-xs text-brand-beige/80">Manage your lost items, candidate matches, claims, and private chats.</p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/report/lost"
            className="px-4 py-2.5 rounded-xl bg-brand-caramel text-white font-bold text-xs shadow-md hover:bg-brand-cream hover:text-brand-dark transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Report Lost
          </Link>
          <Link
            to="/report/found"
            className="px-4 py-2.5 rounded-xl bg-brand-beige text-brand-dark font-bold text-xs shadow-md hover:bg-white transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Report Found
          </Link>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-brand-caramel/20">
        {[
          { id: 'overview', label: 'Overview', icon: LayoutDashboard },
          { id: 'my-items', label: 'My Items', icon: Package, count: myItems.length },
          { id: 'matches', label: 'AI Matches', icon: Sparkles, count: matches.length },
          { id: 'claims', label: 'Claims', icon: ShieldCheck, count: claims.length },
          { id: 'messages', label: 'Messages', icon: MessageSquare, count: conversations.length },
          { id: 'profile', label: 'Account Settings', icon: User }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-brand-dark text-white shadow-md'
                  : 'bg-brand-cream border border-brand-caramel/20 text-brand-dark hover:bg-brand-beige'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-brand-caramel' : ''}`} />
              <span>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] ${
                    isActive ? 'bg-brand-caramel text-white' : 'bg-brand-caramel/20 text-brand-dark'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardStatCard
              title="My Reports"
              value={stats?.userTotalReports || myItems.length}
              icon={Package}
              subtitle="Total submissions"
              color="dark"
            />
            <DashboardStatCard
              title="Active AI Matches"
              value={stats?.userActiveMatches || matches.length}
              icon={Sparkles}
              subtitle="Candidate items found"
              color="caramel"
            />
            <DashboardStatCard
              title="Pending Claims"
              value={stats?.userPendingClaims || claims.filter((c) => c.status === 'PENDING').length}
              icon={ShieldCheck}
              subtitle="Awaiting verification"
              color="amber"
            />
            <DashboardStatCard
              title="Recovered Items"
              value={stats?.userRecoveredCount || myItems.filter((i) => i.status === 'RECOVERED').length}
              icon={CheckCircle2}
              subtitle="Reunited successfully"
              color="emerald"
            />
          </div>

          {/* Recent My Items Preview */}
          <div className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-brand-dark">My Recent Item Reports</h3>
              <button
                onClick={() => handleTabChange('my-items')}
                className="text-xs font-bold text-brand-caramel hover:underline"
              >
                View All →
              </button>
            </div>

            {myItems.length > 0 ? (
              <div className="divide-y divide-brand-beige">
                {myItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                          item.itemType === 'LOST' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {item.itemType}
                      </span>
                      <div>
                        <Link to={`/items/${item.id}`} className="font-bold text-sm text-brand-dark hover:underline">
                          {item.title}
                        </Link>
                        <p className="text-xs text-brand-muted">{item.location}</p>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No reports created yet"
                description="Report a lost or found item to enable AI matching."
                actionLabel="Report an Item"
                actionLink="/report/lost"
              />
            )}
          </div>
        </div>
      )}

      {/* 2. MY ITEMS TAB */}
      {activeTab === 'my-items' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-dark">My Reported Items ({myItems.length})</h2>
            <Link
              to="/report/lost"
              className="px-4 py-2 rounded-xl bg-brand-caramel text-white font-bold text-xs shadow-md"
            >
              + Create New Report
            </Link>
          </div>

          {myItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myItems.map((item) => (
                <div key={item.id} className="bg-brand-cream border border-brand-caramel/20 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                        item.itemType === 'LOST' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {item.itemType}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                  <h3 className="font-bold text-base text-brand-dark line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-brand-muted line-clamp-2">{item.description}</p>
                  <p className="text-xs text-brand-caramel font-semibold">{item.location}</p>
                  <div className="pt-3 border-t border-brand-beige flex items-center justify-between text-xs font-bold">
                    <Link to={`/items/${item.id}`} className="text-brand-dark hover:underline">
                      View Details →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="You haven't submitted any reports"
              description="Start by submitting a lost or found item report."
              actionLabel="Report Lost Item"
              actionLink="/report/lost"
            />
          )}
        </div>
      )}

      {/* 3. MATCHES TAB */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-brand-dark">AI Suggested Matches</h2>
          </div>

          {matches.length > 0 ? (
            <div className="space-y-4">
              {matches.map((m) => {
                const scorePct = Math.round((m.overallScore || 0) * 100);
                return (
                  <div key={m.id} className="bg-brand-cream border border-brand-caramel/20 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full bg-brand-caramel/20 text-brand-dark font-extrabold text-xs">
                          {scorePct}% Similarity Score
                        </span>
                        <span className="text-xs font-bold text-brand-muted uppercase">
                          {m.lostItem?.title} ↔ {m.foundItem?.title}
                        </span>
                      </div>
                      <p className="text-xs text-brand-muted">
                        Lost Location: {m.lostItem?.location} | Found Location: {m.foundItem?.location}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleMatchAction(m.id, 'accept')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs hover:bg-emerald-700"
                      >
                        Accept Match
                      </button>
                      <button
                        onClick={() => handleMatchAction(m.id, 'reject')}
                        className="px-4 py-2 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs hover:bg-rose-50"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState
              title="No AI matches currently"
              description="When our similarity engine detects matching items, candidates will be displayed here."
            />
          )}
        </div>
      )}

      {/* 4. CLAIMS TAB */}
      {activeTab === 'claims' && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-brand-dark">Ownership Claims ({claims.length})</h2>
          {claims.length > 0 ? (
            <div className="space-y-4">
              {claims.map((c) => (
                <div key={c.id} className="bg-brand-cream border border-brand-caramel/20 rounded-2xl p-5 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-dark">
                      Claim for Item: <strong className="text-brand-caramel">{c.itemTitle || c.item?.title}</strong>
                    </span>
                    <StatusBadge status={c.status} />
                  </div>
                  <div className="p-3 bg-brand-beige/50 rounded-xl text-xs space-y-1">
                    <span className="font-bold text-brand-dark">Proof of Ownership Description:</span>
                    <p className="text-brand-muted leading-relaxed">{c.proofDescription}</p>
                  </div>
                  {c.status === 'PENDING' && (
                    <div className="flex justify-end gap-2 pt-2 border-t border-brand-beige">
                      <button
                        onClick={() => handleClaimStatusUpdate(c.id, 'APPROVED')}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                      >
                        Approve Claim
                      </button>
                      <button
                        onClick={() => handleClaimStatusUpdate(c.id, 'REJECTED')}
                        className="px-4 py-1.5 rounded-xl border border-rose-300 text-rose-700 font-bold text-xs"
                      >
                        Reject Claim
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No ownership claims recorded"
              description="Submitted or received claims will be listed here for verification."
            />
          )}
        </div>
      )}

      {/* 5. MESSAGES TAB */}
      {activeTab === 'messages' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-brand-cream border border-brand-caramel/20 rounded-3xl overflow-hidden shadow-xl min-h-[500px]">
          {/* Conversation List */}
          <div className="lg:col-span-4 border-r border-brand-caramel/15 bg-brand-beige/30 p-4 space-y-3">
            <h3 className="font-bold text-sm text-brand-dark uppercase tracking-wider">Conversations</h3>
            {conversations.length > 0 ? (
              <div className="space-y-2">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all ${
                      selectedConversation?.id === conv.id
                        ? 'bg-brand-dark text-white shadow-md'
                        : 'bg-brand-cream hover:bg-brand-beige border border-brand-caramel/15 text-brand-dark'
                    }`}
                  >
                    <p className="font-bold text-xs truncate">{conv.itemTitle || 'Item Conversation'}</p>
                    <p className="text-[11px] opacity-75 truncate mt-0.5">
                      {conv.lastMessage || 'Click to start chatting...'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-brand-muted">No conversations yet.</p>
            )}
          </div>

          {/* Active Message Thread */}
          <div className="lg:col-span-8 flex flex-col justify-between p-6 bg-brand-cream">
            {selectedConversation ? (
              <>
                <div className="border-b border-brand-caramel/15 pb-3">
                  <h3 className="font-bold text-base text-brand-dark">{selectedConversation.itemTitle}</h3>
                  <p className="text-xs text-brand-muted">Protected private thread</p>
                </div>

                <div className="flex-grow py-4 overflow-y-auto space-y-3 max-h-96">
                  {messages.map((m) => {
                    const isMe = m.senderId === user.id || m.sender?.id === user.id;
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                            isMe
                              ? 'bg-brand-dark text-white rounded-br-none shadow-xs'
                              : 'bg-brand-beige text-brand-dark rounded-bl-none border border-brand-caramel/20'
                          }`}
                        >
                          <p>{m.content}</p>
                        </div>
                        <span className="text-[10px] text-brand-muted mt-1 px-1">
                          {m.createdAt ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <form onSubmit={handleSendMessage} className="pt-3 border-t border-brand-caramel/15 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-grow px-4 py-2.5 rounded-xl border border-brand-caramel/25 bg-white text-xs text-brand-dark focus:outline-hidden focus:border-brand-caramel"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-brand-caramel text-white font-bold text-xs shadow-md hover:bg-brand-secondary flex items-center gap-1"
                  >
                    <Send className="w-4 h-4" /> Send
                  </button>
                </form>
              </>
            ) : (
              <div className="m-auto text-center space-y-2 text-brand-muted">
                <MessageSquare className="w-10 h-10 mx-auto text-brand-caramel opacity-50" />
                <p className="text-sm font-semibold">Select a conversation to view messages</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="max-w-xl mx-auto bg-brand-cream border border-brand-caramel/20 rounded-3xl p-8 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-brand-dark">Account Profile Settings</h2>
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <FormField
              label="Full Name"
              id="fullName"
              required
              value={profileForm.fullName}
              onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
            />
            <FormField
              label="Email Address"
              id="email"
              type="email"
              disabled
              value={profileForm.email}
              helpText="Email address cannot be changed directly."
            />
            <FormField
              label="Phone Number"
              id="phone"
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
            />
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-brand-dark text-white font-bold text-xs shadow-md hover:bg-brand-secondary"
            >
              {savingProfile ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
