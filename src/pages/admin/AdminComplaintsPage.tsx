import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  Search,
  Filter,
  Eye,
  Calendar,
  MapPin,
  RefreshCw,
  FolderOpen,
  ArrowUpDown,
  User,
} from 'lucide-react';

interface AdminComplaintsPageProps {
  onNavigate: (page: string, params?: any) => void;
}

const CATEGORIES: ('All' | ComplaintCategory)[] = [
  'All',
  'Classroom',
  'Hostel',
  'Library',
  'Laboratory',
  'Washroom',
  'Electricity',
  'Wi-Fi / Internet',
  'Security',
  'Cleanliness',
  'Other',
];

const STATUSES: ('All' | ComplaintStatus)[] = [
  'All',
  'Pending',
  'In Review',
  'Assigned',
  'Resolved',
  'Rejected',
];

export const AdminComplaintsPage: React.FC<AdminComplaintsPageProps> = ({ onNavigate }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'priority'>('newest');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminComplaints({
        category: selectedCategory,
        status: selectedStatus,
        priority: selectedPriority,
        search: search.trim() || undefined,
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to fetch admin complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedStatus, selectedPriority]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints();
  };

  const priorityWeight: Record<string, number> = {
    Urgent: 4,
    High: 3,
    Medium: 2,
    Low: 1,
  };

  const sortedComplaints = [...complaints].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === 'priority') {
      return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    }
    return 0;
  });

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Administrative Complaints Queue
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit, triage, assign maintenance personnel, and record official resolutions for all students.
          </p>
        </div>

        <button
          onClick={fetchComplaints}
          className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-medium inline-flex items-center gap-1.5 self-start sm:self-auto transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reload Queue</span>
        </button>
      </div>

      {/* Filter and Search Controls */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket ID, title, student name, or location..."
              className="w-full pl-9 pr-20 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400"
            />
            <button
              type="submit"
              className="absolute inset-y-1 right-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
            >
              Filter
            </button>
          </form>

          {/* Quick Sort */}
          <div className="flex items-center gap-2 text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="priority">Highest Urgency</option>
            </select>
          </div>
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <div className="flex items-center gap-1 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-semibold">Filters:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Category: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>

          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700"
          >
            <option value="All">Priority: All</option>
            <option value="Urgent">Priority: Urgent</option>
            <option value="High">Priority: High</option>
            <option value="Medium">Priority: Medium</option>
            <option value="Low">Priority: Low</option>
          </select>

          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSelectedPriority('All');
              setSortBy('newest');
            }}
            className="px-2 py-1 text-slate-500 hover:text-slate-800 text-xs font-medium underline ml-auto"
          >
            Reset Filters
          </button>
        </div>
      </div>

      {/* Complaints Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Loading administrative database records...
          </div>
        ) : sortedComplaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FolderOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No matching complaints</h3>
            <p className="text-xs text-slate-500 mt-1">
              Adjust your filters or search terms to inspect other complaints.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ticket</th>
                  <th className="py-3.5 px-4">Student Info</th>
                  <th className="py-3.5 px-4">Subject & Location</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Logged</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedComplaints.map((item) => (
                  <tr
                    key={item._id}
                    id={`admin-row-${item.complaintId}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Ticket */}
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {item.complaintId}
                    </td>

                    {/* Student Info */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.studentName || 'Student'}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.studentId}
                      </div>
                    </td>

                    {/* Subject & Location */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-sm">
                      <div className="font-semibold text-slate-900 line-clamp-1">{item.title}</div>
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium">
                        {item.category}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Logged Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigate('admin-complaint-details', { id: item._id })}
                        className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-md transition-colors inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
