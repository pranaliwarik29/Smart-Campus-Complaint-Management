import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Complaint, ComplaintCategory, ComplaintStatus } from '../../types';
import { StatusBadge, PriorityBadge } from '../../components/common/StatusBadge';
import {
  Search,
  Filter,
  PlusCircle,
  Eye,
  Calendar,
  MapPin,
  RefreshCw,
  FileQuestion,
} from 'lucide-react';

interface MyComplaintsPageProps {
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

export const MyComplaintsPage: React.FC<MyComplaintsPageProps> = ({ onNavigate }) => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.getComplaints({
        category: selectedCategory,
        status: selectedStatus,
        search: search.trim() || undefined,
      });
      setComplaints(res.data);
    } catch (err) {
      console.error('Failed to retrieve complaints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [selectedCategory, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchComplaints();
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            My Lodged Complaints
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time progress, inspection updates, and administrative remarks for your tickets.
          </p>
        </div>
        <button
          onClick={() => onNavigate('submit-complaint')}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xs text-xs font-semibold inline-flex items-center gap-2 self-start sm:self-auto transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket ID, title, or location..."
            className="w-full pl-9 pr-20 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 placeholder-slate-400"
          />
          <button
            type="submit"
            className="absolute inset-y-1 right-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-medium transition-colors"
          >
            Find
          </button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span className="font-medium">Filter:</span>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                Dept: {c}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs bg-white text-slate-700 focus:ring-1 focus:ring-blue-500"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                Status: {s}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedStatus('All');
            }}
            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium underline"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Complaints Table Container */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-600" />
            Fetching complaint records...
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <FileQuestion className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">No complaints found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {search || selectedCategory !== 'All' || selectedStatus !== 'All'
                ? 'Try broadening your search criteria or clearing filters.'
                : 'You have not submitted any complaints yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                  <th className="py-3.5 px-4">Ticket ID</th>
                  <th className="py-3.5 px-4">Title & Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Date Logged</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {complaints.map((item) => (
                  <tr
                    key={item._id}
                    id={`complaint-row-${item.complaintId}`}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    {/* Complaint ID */}
                    <td className="py-3.5 px-4 font-mono font-semibold text-blue-700 whitespace-nowrap">
                      {item.complaintId}
                    </td>

                    {/* Title & Location */}
                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
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

                    {/* Date */}
                    <td className="py-3.5 px-4 whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>

                    {/* Priority */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <PriorityBadge priority={item.priority} size="sm" />
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={item.status} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onNavigate('complaint-details', { id: item._id })}
                        className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors inline-flex items-center gap-1.5 shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        <span>View Details</span>
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
