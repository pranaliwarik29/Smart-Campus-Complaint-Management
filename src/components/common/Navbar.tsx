import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, LogOut, User as UserIcon, Menu } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar?: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar, onNavigate }) => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-slate-900 text-white border-b border-slate-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand and Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                id="sidebar-toggle-btn"
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                aria-label="Toggle Navigation Sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <button
              onClick={() => {
                if (!isAuthenticated) onNavigate('landing');
                else if (user?.role === 'admin') onNavigate('admin-dashboard');
                else onNavigate('student-dashboard');
              }}
              className="flex items-center gap-3 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm shadow-blue-500/30 ring-1 ring-white/10 group-hover:bg-blue-500 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold tracking-tight text-base text-white">CampusCare</span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    College Portal
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-normal leading-none hidden sm:inline">
                  Smart Campus Complaint Management System
                </span>
              </div>
            </button>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                {/* User badge */}
                <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-xs">
                  <div className="w-7 h-7 rounded-full bg-slate-700 flex items-center justify-center text-slate-200">
                    <UserIcon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium text-slate-200 truncate max-w-[130px]">{user.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {user.role === 'admin' ? 'Administrator' : user.studentId}
                    </div>
                  </div>
                  <span
                    className={`ml-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded ${
                      user.role === 'admin'
                        ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
                        : 'bg-blue-400/15 text-blue-300 border border-blue-400/30'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>

                {/* Logout action */}
                <button
                  id="navbar-logout-btn"
                  onClick={() => {
                    logout();
                    onNavigate('landing');
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="nav-login-btn"
                  onClick={() => onNavigate('login')}
                  className="px-3.5 py-1.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button
                  id="nav-register-btn"
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors"
                >
                  Student Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
