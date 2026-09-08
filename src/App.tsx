import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { StudentDashboard } from './pages/student/StudentDashboard';
import { SubmitComplaintPage } from './pages/student/SubmitComplaintPage';
import { MyComplaintsPage } from './pages/student/MyComplaintsPage';
import { ComplaintDetailsPage } from './pages/student/ComplaintDetailsPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminComplaintsPage } from './pages/admin/AdminComplaintsPage';
import { AdminComplaintDetailsPage } from './pages/admin/AdminComplaintDetailsPage';
import { RefreshCw } from 'lucide-react';

function MainApp() {
  const { user, loading, isAuthenticated, isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<string>('landing');
  const [pageParams, setPageParams] = useState<any>({});
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const navigate = (page: string, params: any = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Protected Route Guards
  useEffect(() => {
    if (loading) return;

    const protectedPages = [
      'student-dashboard',
      'submit-complaint',
      'my-complaints',
      'complaint-details',
      'admin-dashboard',
      'admin-complaints',
      'admin-complaint-details',
    ];

    const adminOnlyPages = [
      'admin-dashboard',
      'admin-complaints',
      'admin-complaint-details',
    ];

    if (protectedPages.includes(currentPage) && !isAuthenticated) {
      navigate('login');
      return;
    }

    if (adminOnlyPages.includes(currentPage) && isAuthenticated && !isAdmin) {
      navigate('student-dashboard');
      return;
    }
  }, [currentPage, isAuthenticated, isAdmin, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-3" />
        <div className="font-semibold text-sm tracking-wide">CampusCare System</div>
        <div className="text-xs text-slate-400 mt-1">Initializing institutional session...</div>
      </div>
    );
  }

  const isStandalonePage = ['landing', 'login', 'register'].includes(currentPage);
  const showSidebar = isAuthenticated && !isStandalonePage;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        currentPage={currentPage}
        onNavigate={navigate}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* Main Body */}
      <div className="flex-1 flex">
        {showSidebar && (
          <Sidebar
            currentPage={currentPage}
            onNavigate={navigate}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        {/* Page Content Viewport */}
        <main
          className={`flex-1 transition-all duration-200 ${
            showSidebar ? 'lg:pl-64' : ''
          }`}
        >
          <div className={isStandalonePage ? '' : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6'}>
            {currentPage === 'landing' && <LandingPage onNavigate={navigate} />}
            {currentPage === 'login' && <LoginPage onNavigate={navigate} />}
            {currentPage === 'register' && <RegisterPage onNavigate={navigate} />}

            {/* Student Pages */}
            {currentPage === 'student-dashboard' && <StudentDashboard onNavigate={navigate} />}
            {currentPage === 'submit-complaint' && <SubmitComplaintPage onNavigate={navigate} />}
            {currentPage === 'my-complaints' && <MyComplaintsPage onNavigate={navigate} />}
            {currentPage === 'complaint-details' && (
              <ComplaintDetailsPage
                complaintId={pageParams.id}
                onNavigate={navigate}
              />
            )}

            {/* Admin Pages */}
            {currentPage === 'admin-dashboard' && <AdminDashboard onNavigate={navigate} />}
            {currentPage === 'admin-complaints' && <AdminComplaintsPage onNavigate={navigate} />}
            {currentPage === 'admin-complaint-details' && (
              <AdminComplaintDetailsPage
                complaintId={pageParams.id}
                onNavigate={navigate}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
