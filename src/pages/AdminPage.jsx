import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Package,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  Lock,
  Unlock,
  Trash2,
  FileText,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import api from '../api/axios';
import { useNotification } from '../context/NotificationContext';
import DashboardStatCard from '../components/common/DashboardStatCard';
import StatusBadge from '../components/common/StatusBadge';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export const AdminPage = () => {
  const { showToast } = useNotification();
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const [adminStats, setAdminStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [reportsList, setReportsList] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      const [statsRes, usersRes, reportsRes, auditRes] = await Promise.allSettled([
        api.get('/admin/dashboard'),
        api.get('/admin/users'),
        api.get('/admin/reports'),
        api.get('/admin/audit-logs')
      ]);

      if (statsRes.status === 'fulfilled') setAdminStats(statsRes.value.data);
      if (usersRes.status === 'fulfilled') setUsersList(usersRes.value.data || []);
      if (reportsRes.status === 'fulfilled') setReportsList(reportsRes.value.data || []);
      if (auditRes.status === 'fulfilled') setAuditLogs(auditRes.value.data || []);
    } catch (e) {
      console.warn('Admin fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUserStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    try {
      await api.patch(`/admin/users/${userId}/status`, { status: nextStatus });
      showToast(`User status updated to ${nextStatus}`, 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to update user status.', 'error');
    }
  };

  const handleDeleteReportAdmin = async (reportId) => {
    try {
      await api.delete(`/admin/reports/${reportId}`);
      showToast('Report removed by admin moderation.', 'success');
      fetchAdminData();
    } catch (err) {
      showToast('Failed to delete report.', 'error');
    }
  };

  const categoryData = adminStats?.reportsByCategory
    ? Object.entries(adminStats.reportsByCategory).map(([name, value]) => ({ name, value }))
    : [
        { name: 'Electronics', value: 14 },
        { name: 'Wallets', value: 9 },
        { name: 'Keys', value: 7 },
        { name: 'Bags', value: 5 },
        { name: 'ID Cards', value: 12 }
      ];

  const COLORS = ['#C58B55', '#765341', '#4A2F27', '#10B981', '#F59E0B'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-950 via-brand-dark to-amber-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold mb-2 border border-amber-400/30">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrator Operations Portal
          </div>
          <h1 className="text-3xl font-extrabold">System Governance & Moderation</h1>
          <p className="text-xs text-amber-100/80 mt-1">
            Monitor activity, moderate lost & found reports, manage accounts, and view audit trails.
          </p>
        </div>
      </div>

      {/* Subtabs Navigation */}
      <div className="flex items-center gap-2 border-b border-brand-caramel/20 pb-2">
        {[
          { id: 'overview', label: 'Analytics Overview', icon: Activity },
          { id: 'users', label: 'User Directory', icon: Users, count: usersList.length },
          { id: 'reports', label: 'Report Moderation', icon: Package, count: reportsList.length },
          { id: 'audit', label: 'Audit Logs', icon: FileText, count: auditLogs.length }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-amber-950 text-white shadow-md'
                  : 'bg-brand-cream border border-brand-caramel/20 text-brand-dark hover:bg-brand-beige'
              }`}
            >
              <Icon className="w-4 h-4 text-brand-caramel" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-brand-caramel/20 text-brand-dark font-extrabold">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT */}

      {/* OVERVIEW */}
      {activeSubTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <DashboardStatCard
              title="Registered Users"
              value={adminStats?.totalUsers || usersList.length}
              icon={Users}
              subtitle="Active community members"
              color="dark"
            />
            <DashboardStatCard
              title="Total Item Reports"
              value={adminStats?.totalReports || reportsList.length}
              icon={Package}
              subtitle="Lost + Found submissions"
              color="caramel"
            />
            <DashboardStatCard
              title="Recovered Belongings"
              value={adminStats?.recoveredCount || 0}
              icon={CheckCircle2}
              subtitle="Confirmed recoveries"
              color="emerald"
            />
            <DashboardStatCard
              title="System Recovery Rate"
              value={`${adminStats?.recoveryRate || 85}%`}
              icon={TrendingUp}
              subtitle="Successful reunites ratio"
              color="amber"
            />
          </div>

          {/* Recharts Data Graphs */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-base text-brand-dark">Reports Distribution by Category</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <XAxis dataKey="name" stroke="#7A6A60" fontSize={11} />
                    <YAxis stroke="#7A6A60" fontSize={11} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#C58B55" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-5 bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 space-y-4 shadow-xs">
              <h3 className="font-bold text-base text-brand-dark">Item Type Composition</h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* USERS MANAGEMENT */}
      {activeSubTab === 'users' && (
        <div className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-lg text-brand-dark">Registered System Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-brand-dark">
              <thead className="bg-brand-beige/60 text-brand-muted font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5 rounded-l-xl">User Name</th>
                  <th className="p-3.5">Email</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 rounded-r-xl text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-beige">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-brand-beige/30 transition-colors">
                    <td className="p-3.5 font-bold">{u.fullName}</td>
                    <td className="p-3.5 text-brand-muted">{u.email}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${u.role === 'ADMIN' ? 'bg-amber-100 text-amber-900' : 'bg-brand-beige text-brand-dark'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${u.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-900' : 'bg-rose-100 text-rose-900'}`}>
                        {u.status || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleUserStatus(u.id, u.status || 'ACTIVE')}
                          className="px-3 py-1 rounded-lg text-xs font-bold border border-brand-caramel/30 hover:bg-brand-beige"
                        >
                          {u.status === 'SUSPENDED' ? 'Reactivate' : 'Suspend'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT MODERATION */}
      {activeSubTab === 'reports' && (
        <div className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-lg text-brand-dark">Report Moderation Directory</h2>
          <div className="divide-y divide-brand-beige">
            {reportsList.map((r) => (
              <div key={r.id} className="py-4 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${r.itemType === 'LOST' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {r.itemType}
                    </span>
                    <h4 className="font-bold text-sm text-brand-dark">{r.title}</h4>
                  </div>
                  <p className="text-xs text-brand-muted truncate max-w-lg">{r.description}</p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={r.status} />
                  <button
                    onClick={() => handleDeleteReportAdmin(r.id)}
                    className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200"
                    title="Remove item report"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AUDIT LOGS */}
      {activeSubTab === 'audit' && (
        <div className="bg-brand-cream border border-brand-caramel/20 rounded-3xl p-6 space-y-4 shadow-xs">
          <h2 className="font-bold text-lg text-brand-dark">Admin Audit Activity Stream</h2>
          <div className="space-y-2">
            {auditLogs.length > 0 ? (
              auditLogs.map((log) => (
                <div key={log.id} className="p-3 bg-brand-beige/40 rounded-xl text-xs flex justify-between items-center">
                  <div>
                    <span className="font-bold text-brand-dark">{log.action}</span>
                    <span className="text-brand-muted ml-2">{log.details}</span>
                  </div>
                  <span className="text-[10px] text-brand-muted">
                    {log.createdAt ? new Date(log.createdAt).toLocaleString() : 'Recent'}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-brand-muted">No audit logs recorded yet.</p>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPage;
