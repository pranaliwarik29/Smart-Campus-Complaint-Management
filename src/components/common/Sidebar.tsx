import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  ShieldAlert,
  BarChart3,
  X,
  ExternalLink,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate, isOpen, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  const studentLinks = [
    { id: 'student-dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'submit-complaint', label: 'Submit Complaint', icon: PlusCircle },
    { id: 'my-complaints', label: 'My Complaints', icon: FileText },
  ];

  const adminLinks = [
    { id: 'admin-dashboard', label: 'Admin Analytics', icon: BarChart3 },
    { id: 'admin-complaints', label: 'Manage Complaints', icon: ShieldAlert },
  ];

  const links = isAdmin ? adminLinks : studentLinks;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden backdrop-blur-[1px]"
        />
      )}

      {/* Sidebar container */}
      <aside
        id="app-sidebar"
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-slate-900 border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col justify-between`}
      >
        <div className="p-4 space-y-6">
          {/* Header row in mobile */}
          <div className="flex items-center justify-between lg:hidden pb-2 border-b border-slate-800">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {isAdmin ? 'Admin Navigation' : 'Student Portal'}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User profile card inside sidebar */}
          <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-800">
            <div className="text-xs font-semibold text-slate-200 truncate">{user?.name}</div>
            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
              {isAdmin ? 'Admin ID: ' + user?.studentId : 'Roll: ' + user?.studentId}
            </div>
            <div className="mt-2 pt-2 border-t border-slate-700/60 flex items-center justify-between text-[11px] text-slate-400">
              <span>Role:</span>
              <span className="capitalize font-medium text-slate-300">{user?.role}</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-semibold tracking-wider text-slate-400 uppercase px-3 mb-2">
              Menu
            </div>
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <button
                  key={link.id}
                  id={`nav-link-${link.id}`}
                  onClick={() => {
                    onNavigate(link.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Helper Info */}
        <div className="p-4 border-t border-slate-800 text-xs text-slate-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-slate-300">CampusCare v1.4</span>
            <span className="inline-flex items-center gap-1 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Online
            </span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Official collegiate complaint registry & resolution desk.
          </p>
          <button
            onClick={() => {
              onNavigate('landing');
              onClose();
            }}
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 text-[11px] transition-colors pt-1"
          >
            <ExternalLink className="w-3 h-3" />
            <span>CampusCare Public Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
};
