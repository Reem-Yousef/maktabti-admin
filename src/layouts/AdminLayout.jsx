import { useEffect, useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout() {
  const { session } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    const toggleSidebar = () => setMobileNavOpen((current) => !current);
    window.addEventListener('toggle-sidebar', toggleSidebar);
    return () => window.removeEventListener('toggle-sidebar', toggleSidebar);
  }, []);

  if (!session) return <Navigate to="/login" replace />;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-app-bg">
      <div
        className={`fixed inset-0 z-40 bg-navy/40 transition-opacity sm:hidden ${mobileNavOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setMobileNavOpen(false)}
      />

      <div className="relative flex min-h-screen">
        <Sidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
        <main className="scrollbar-thin flex-1 min-w-0 overflow-x-hidden overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
