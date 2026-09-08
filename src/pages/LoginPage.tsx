import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/common/Toast';
import { ShieldCheck, LogIn, Lock, Mail, ArrowLeft, KeyRound } from 'lucide-react';

interface LoginPageProps {
  onNavigate: (page: string) => void;
  initialRole?: 'student' | 'admin';
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, initialRole = 'student' }) => {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [role, setRole] = useState<'student' | 'admin'>(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fillDemoStudent = () => {
    setRole('student');
    setEmail('alex.rivers@college.edu');
    setPassword('Student@1234');
    setError(null);
  };

  const fillDemoAdmin = () => {
    setRole('admin');
    setEmail('admin@campuscare.edu');
    setPassword('Admin@1234');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login(email, password, role);
      showToast('success', `Welcome back, ${user.name}!`);

      if (user.role === 'admin') {
        onNavigate('admin-dashboard');
      } else {
        onNavigate('student-dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
      showToast('error', err.message || 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <button
          onClick={() => onNavigate('landing')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 mb-6 font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-sans">CampusCare</span>
        </div>
        <h2 className="text-center text-2xl font-bold tracking-tight text-slate-900">
          Campus Portal Sign In
        </h2>
        <p className="mt-1 text-center text-xs text-slate-600">
          Authenticate using your institutional credentials
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-8 border border-slate-200 rounded-xl shadow-xs">
          {/* Role selection tab */}
          <div className="mb-6">
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Sign In As:</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
              <button
                type="button"
                id="role-tab-student"
                onClick={() => {
                  setRole('student');
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  role === 'student'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student Portal
              </button>
              <button
                type="button"
                id="role-tab-admin"
                onClick={() => {
                  setRole('admin');
                  setError(null);
                }}
                className={`py-2 text-xs font-semibold rounded-md transition-all ${
                  role === 'admin'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin / Authority
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-700 mb-1">
                Institutional Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'admin@campuscare.edu' : 'alex.rivers@college.edu'}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white placeholder-slate-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="login-password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-slate-900 bg-white placeholder-slate-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                id="submit-login-btn"
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Sign In to {role === 'admin' ? 'Admin Desk' : 'Student Portal'}</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Demo Credentials Panel */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-2">
              <KeyRound className="w-3.5 h-3.5 text-slate-500" />
              <span>Quick Demo Fill (Instant Testing):</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                id="demo-student-btn"
                onClick={fillDemoStudent}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] transition-colors"
              >
                <div className="font-semibold text-slate-800">Student Demo</div>
                <div className="text-slate-500 truncate">Alex Rivers (CS)</div>
              </button>
              <button
                type="button"
                id="demo-admin-btn"
                onClick={fillDemoAdmin}
                className="p-2 text-left bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-[11px] transition-colors"
              >
                <div className="font-semibold text-slate-800">Admin Demo</div>
                <div className="text-slate-500 truncate">Dr. Arthur Mitchell</div>
              </button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-600">
              New student without an account?{' '}
              <button
                onClick={() => onNavigate('register')}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
