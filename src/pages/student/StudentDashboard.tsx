import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Complaint } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  MapPin,
  ArrowRight,
  RefreshCw,
  Bell,
} from 'lucide-react';

interface StudentDashboardProps {
  onNavigate: (page: string, params?: any) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchComplaints = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const res = await api.getComplaints();
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to load student complaints', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const total = complaints.length;
  const pending = complaints.filter((c) => c.status === 'Pending').length;
  const inReview = complaints.filter((c) => c.status === 'In Review' || c.status === 'Assigned').length;
  const resolved = complaints.filter((c) => c.status === 'Resolved').length;

  const recentComplaints = complaints.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome header */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              Welcome back, {user?.name}
            </h1>
            <span className="text-xs px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-medium border border-blue-200">
              {user?.studentId}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official Campus Redressal Portal • Submit, monitor, and track status updates for facilities & services.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchComplaints(true)}
            disabled={refreshing}
            className="p-2.5 text-slate-500 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors text-xs font-medium inline-flex items-center gap-1.5"
            title="Refresh dashboard data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            id="student-new-complaint-btn"
            onClick={() => onNavigate('submit-complaint')}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs text-xs font-semibold inline-flex items-center gap-2 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>File New Complaint</span>
          </button>
        </div>
      </div>

      {/* KPI Metric summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Registered</span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-700">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{total}</span>
            <span className="text-xs text-slate-400">tickets</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Triage</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-700">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-800">{pending}</span>
            <span className="text-xs text-amber-600">awaiting review</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">In Progress / Assigned</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-700">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-blue-800">{inReview}</span>
            <span className="text-xs text-blue-600">active action</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Resolved</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-800">{resolved}</span>
            <span className="text-xs text-emerald-600">completed</span>
          </div>
        </div>
      </div>

      {/* Main content grid: Recent Complaints + Campus Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Complaints (2 cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Your Recent Complaints</h2>
              <p className="text-xs text-slate-500">Recently filed grievances and their current status</p>
            </div>
            <button
              onClick={() => onNavigate('my-complaints')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
              Loading complaints...
            </div>
          ) : recentComplaints.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-800">No complaints registered yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                If you encounter any issues regarding classroom AV, hostel Wi-Fi, electricity, or cleanliness, report it here.
              </p>
              <button
                onClick={() => onNavigate('submit-complaint')}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit First Complaint</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 overflow-x-auto">
              {recentComplaints.map((item) => (
                <div
                  key={item._id}
                  id={`recent-complaint-${item.complaintId}`}
                  className="p-4 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {item.complaintId}
                      </span>
                      <span className="text-xs font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      <PriorityBadge priority={item.priority} size="sm" />
                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    <h3 className="text-sm font-semibold text-slate-900 leading-snug">{item.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        <span className="truncate max-w-[200px]">{item.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => onNavigate('complaint-details', { id: item._id })}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors inline-flex items-center gap-1"
                    >
                      <span>View Details</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Campus Advisory & Important Guidelines */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 text-slate-900 font-semibold text-sm mb-3">
              <Bell className="w-4 h-4 text-blue-600" />
              <span>Campus Advisory Desk</span>
            </div>
            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-100">
                <span className="font-semibold text-blue-900 block mb-1">Wi-Fi Maintenance Notice</span>
                Central IT is upgrading access point firmware in Academic Block B on Friday from 10:00 PM to 12:00 AM.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">Photographic Evidence</span>
                Uploading a clear picture of equipment malfunction or leaks speeds up technician triage by 50%.
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-semibold text-slate-900 block mb-1">Emergency Escalation</span>
                For water line bursts or exposed live electrical wires, contact Campus Control Room: Ext 4410.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
