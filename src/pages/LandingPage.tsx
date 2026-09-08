import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  FileCheck2,
  Clock,
  ArrowRight,
  Wifi,
  Zap,
  BookOpen,
  FlaskConical,
  Building,
  Sparkles,
  Lock,
  Compass,
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const { isAuthenticated, user } = useAuth();

  const handleReportClick = () => {
    if (!isAuthenticated) {
      onNavigate('login');
    } else if (user?.role === 'admin') {
      onNavigate('admin-dashboard');
    } else {
      onNavigate('submit-complaint');
    }
  };

  const handleTrackClick = () => {
    if (!isAuthenticated) {
      onNavigate('login');
    } else if (user?.role === 'admin') {
      onNavigate('admin-complaints');
    } else {
      onNavigate('my-complaints');
    }
  };

  const categories = [
    { name: 'Classroom & AV', icon: Building, desc: 'Projectors, smartboards, mics, seating' },
    { name: 'Wi-Fi & Network', icon: Wifi, desc: 'Access point drops, portal login, bandwidth' },
    { name: 'Hostel Facilities', icon: Building, desc: 'Plumbing, fixtures, room power, heating' },
    { name: 'Laboratories', icon: FlaskConical, desc: 'Bench equipment, safety vents, instrumentation' },
    { name: 'Electricity & Lighting', icon: Zap, desc: 'Corridor lights, faulty switches, breakers' },
    { name: 'Library & Quiet Zones', icon: BookOpen, desc: 'Study desks, AC cooling, reference facilities' },
    { name: 'Cleanliness & Waste', icon: Sparkles, desc: 'Restroom sanitation, spill cleanup, bins' },
    { name: 'Campus Safety', icon: Lock, desc: 'Access gates, emergency points, lighting' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Banner / Hero section */}
      <section className="relative overflow-hidden bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="max-w-3xl">
            {/* College header badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-800 text-xs font-medium mb-6">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>Official Collegiate Redressal Portal</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950 font-serif leading-tight">
              CampusCare <span className="text-blue-700 block sm:inline font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold text-slate-700">— Smart Campus Complaint Management System</span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              An accountable, transparent service desk connecting students directly with academic facilities, IT networking, hostel management, and physical infrastructure teams.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                id="hero-report-btn"
                onClick={handleReportClick}
                className="px-5 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm hover:shadow transition-all inline-flex items-center gap-2"
              >
                <span>Report a Complaint</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="hero-track-btn"
                onClick={handleTrackClick}
                className="px-5 py-3 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg shadow-xs transition-colors inline-flex items-center gap-2"
              >
                <span>Track Complaint Status</span>
                <Clock className="w-4 h-4 text-slate-500" />
              </button>

              {!isAuthenticated && (
                <button
                  id="hero-login-btn"
                  onClick={() => onNavigate('login')}
                  className="px-4 py-3 text-sm font-medium text-blue-700 hover:text-blue-800 hover:bg-blue-50/80 rounded-lg transition-colors"
                >
                  Admin / Staff Sign In →
                </button>
              )}
            </div>

            {/* Trust points */}
            <div className="mt-10 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Unique Ticket Reference Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>24–48h Triage Commitment</span>
              </div>
              <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
                <Compass className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>Photographic Evidence Uploads</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Standard Grievance Resolution Workflow
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Complaints follow an audited multi-stage administrative path from registration to inspection and closure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="w-8 h-8 rounded-md bg-blue-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-3">
                1
              </div>
              <h3 className="text-sm font-semibold text-slate-900">1. Lodge Grievance</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Student specifies location, selects department category, assigns initial urgency, and attaches photo evidence.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-white font-mono font-bold flex items-center justify-center text-sm mb-3">
                2
              </div>
              <h3 className="text-sm font-semibold text-slate-900">2. Administrative Triage</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Central campus affairs desk inspects validity, changes status to "In Review", and schedules technicians.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="w-8 h-8 rounded-md bg-slate-800 text-white font-mono font-bold flex items-center justify-center text-sm mb-3">
                3
              </div>
              <h3 className="text-sm font-semibold text-slate-900">3. Assignment & Repair</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Work order dispatched to relevant electrician, plumber, AV technician, or contractor with ticket reference.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-5">
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white font-mono font-bold flex items-center justify-center text-sm mb-3">
                4
              </div>
              <h3 className="text-sm font-semibold text-slate-900">4. Closure & Feedback</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Official logs administrative completion remarks; status shifts to "Resolved" with complete timestamp history.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Covered Campus Departments</h2>
              <p className="text-xs text-slate-600 mt-1">
                Select your relevant concern category during complaint filing.
              </p>
            </div>
            <button
              onClick={handleReportClick}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
            >
              Submit Ticket For Any Category →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors"
                >
                  <div className="w-8 h-8 rounded-md bg-slate-100 flex items-center justify-center text-slate-700 mb-2.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-slate-900">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{cat.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-200">CampusCare Management Portal</span>
            <span className="text-slate-600">|</span>
            <span>Academic Session 2026</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Dean of Student Affairs</span>
            <span>•</span>
            <span>Campus Maintenance Desk</span>
            <span>•</span>
            <button onClick={() => onNavigate('login')} className="hover:text-white underline">
              Admin Gateway
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
