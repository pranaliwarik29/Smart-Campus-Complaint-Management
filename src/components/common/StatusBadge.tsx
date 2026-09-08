import React from 'react';
import { ComplaintStatus, ComplaintPriority } from '../../types';

interface StatusBadgeProps {
  status: ComplaintStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (status) {
    case 'Pending':
      return (
        <span
          id={`status-${status.toLowerCase()}`}
          className={`inline-flex items-center gap-1.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Pending
        </span>
      );
    case 'In Review':
      return (
        <span
          id={`status-in-review`}
          className={`inline-flex items-center gap-1.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          In Review
        </span>
      );
    case 'Assigned':
      return (
        <span
          id={`status-assigned`}
          className={`inline-flex items-center gap-1.5 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
          Assigned
        </span>
      );
    case 'Resolved':
      return (
        <span
          id={`status-resolved`}
          className={`inline-flex items-center gap-1.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Resolved
        </span>
      );
    case 'Rejected':
      return (
        <span
          id={`status-rejected`}
          className={`inline-flex items-center gap-1.5 rounded-md bg-rose-50 text-rose-800 border border-rose-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          Rejected
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-slate-100 text-slate-700 border border-slate-200 ${sizeClasses}`}>
          {status}
        </span>
      );
  }
};

interface PriorityBadgeProps {
  priority: ComplaintPriority | string;
  size?: 'sm' | 'md';
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-0.5 text-xs font-medium';

  switch (priority) {
    case 'Urgent':
      return (
        <span
          id={`priority-urgent`}
          className={`inline-flex items-center rounded bg-red-100 text-red-800 font-semibold border border-red-300 ${sizeClasses}`}
        >
          Urgent
        </span>
      );
    case 'High':
      return (
        <span
          id={`priority-high`}
          className={`inline-flex items-center rounded bg-orange-50 text-orange-800 font-medium border border-orange-200 ${sizeClasses}`}
        >
          High
        </span>
      );
    case 'Medium':
      return (
        <span
          id={`priority-medium`}
          className={`inline-flex items-center rounded bg-slate-100 text-slate-800 font-medium border border-slate-200 ${sizeClasses}`}
        >
          Medium
        </span>
      );
    case 'Low':
      return (
        <span
          id={`priority-low`}
          className={`inline-flex items-center rounded bg-gray-50 text-gray-600 font-medium border border-gray-200 ${sizeClasses}`}
        >
          Low
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded bg-gray-100 text-gray-700 ${sizeClasses}`}>
          {priority}
        </span>
      );
  }
};
