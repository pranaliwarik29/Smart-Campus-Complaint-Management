import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { AdminStats } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  BarChart3,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  FolderKanban,
  User,
  ShieldCheck,
} from 'lucide-react';

interface AdminDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.getAdminStats();
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-16 text-center text-slate-400 text-xs">
        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
        Loading administrative metrics & complaints queue...
      </div>
    );
  }

  const categoryEntries = (Object.entries(stats.byCategory || {}) as [string, number][]).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Campus Grievance Administration
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-300">
              Authority Desk
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time grievance telemetry, department categorization, and work order dispatch overview.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchStats(true)}
            disabled={refreshing}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-xs font-medium inline-flex items-center gap-1.5"
            title="Refresh statistics"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => onNavigate('admin-complaints')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <FolderKanban className="w-4 h-4" />
            <span>Manage All Tickets</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Total */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Tickets
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900">{stats.total}</div>
          <span className="text-[10px] text-slate-400">All departments</span>
        </div>

        {/* Pending */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-amber-700">{stats.pending}</div>
          <span className="text-[10px] text-amber-600">Awaiting triage</span>
        </div>

        {/* In Review */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>In Review</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-blue-700">{stats.inReview}</div>
          <span className="text-[10px] text-blue-600">Active inspection</span>
        </div>

        {/* Assigned */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>Assigned</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-indigo-700">{stats.assigned}</div>
          <span className="text-[10px] text-indigo-600">With contractors</span>
        </div>

        {/* Resolved */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Resolved</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-emerald-700">{stats.resolved}</div>
          <span className="text-[10px] text-emerald-600">Closed issues</span>
        </div>

        {/* Rejected */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
          <div className="mt-2 text-2xl font-bold text-rose-700">{stats.rejected}</div>
          <span className="text-[10px] text-rose-500">Invalid / Duplicates</span>
        </div>
      </div>

      {/* Resolution Rate Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-semibold">Campus Grievance Resolution Rate</div>
            <div className="text-xs text-slate-400">
              {stats.resolved} out of {stats.total} complaints marked resolved
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-48 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.resolutionPercentage}%` }}
            />
          </div>
          <span className="text-xl font-bold font-mono text-emerald-400">
            {stats.resolutionPercentage}%
          </span>
        </div>
      </div>

      {/* Analytics Breakdown & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown (1 col) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-slate-700" />
              <h2 className="text-sm font-bold text-slate-900">Complaints by Department</h2>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">Volume</span>
          </div>

          <div className="space-y-3 text-xs">
            {categoryEntries.length === 0 ? (
              <p className="text-slate-400 text-xs py-4 text-center">No categories recorded yet.</p>
            ) : (
              categoryEntries.map(([categoryName, count]) => {
                const percentage = stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
                return (
                  <div key={categoryName} className="space-y-1">
                    <div className="flex justify-between text-slate-700">
                      <span className="font-medium truncate max-w-[170px]">{categoryName}</span>
                      <span className="font-mono text-slate-500">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-blue-600 h-full rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Complaints Queue (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Recent Complaints Queue</h2>
              <p className="text-xs text-slate-500">Awaiting review, technician dispatch, or status updates</p>
            </div>
            <button
              onClick={() => onNavigate('admin-complaints')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>Manage All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 overflow-x-auto">
            {stats.recent.map((item) => (
              <div
                key={item._id}
                className="p-4 hover:bg-slate-50/80 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-1 max-w-lg">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-[11px]">
                      {item.complaintId}
                    </span>
                    <span className="font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                      {item.category}
                    </span>
                    <PriorityBadge priority={item.priority} size="sm" />
                    <StatusBadge status={item.status} size="sm" />
                  </div>

                  <h3 className="font-semibold text-slate-900 text-sm leading-snug">{item.title}</h3>

                  <div className="flex items-center gap-3 text-slate-500 text-[11px]">
                    <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{item.studentName} ({item.studentId})</span>
                    </span>
                    <span>•</span>
                    <span>{item.location}</span>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => onNavigate('admin-complaint-details', { id: item._id })}
                    className="px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors inline-flex items-center gap-1"
                  >
                    <span>Manage Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
