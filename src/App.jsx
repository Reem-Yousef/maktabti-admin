import { useEffect } from 'react';
import { Routes, Route, useNavigate, Navigate, Outlet } from 'react-router-dom';
import { useAuth, AuthProvider } from './context/AuthContext';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MaterialManagement from './pages/MaterialManagement';
import Categories from './pages/Categories';
import ExaminationArchive from './pages/ExaminationArchive';
import GraduationProjectReview from './pages/GraduationProjectReview';
import ChangePassword from './pages/ChangePassword';
import CreateAdmin from './pages/CreateAdmin';

function RequireSuperAdmin() {
  const { isSuperAdmin } = useAuth();
  return isSuperAdmin ? <Outlet /> : <Navigate to="/" replace />;
}

function AppRoutes() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = () => {
      navigate('/login?error=session-expired', { replace: true });
    };
    window.addEventListener('auth-logout', handleLogout);
    return () => window.removeEventListener('auth-logout', handleLogout);
  }, [navigate]);

  return (
    <Routes>
      <Route path="/login"           element={<Login />} />
      <Route path="/change-password" element={<ChangePassword />} />

      <Route element={<AdminLayout />}>
        <Route path="/"                    element={<Dashboard />} />
        <Route path="/materials"           element={<MaterialManagement />} />
        <Route path="/categories"          element={<Categories />} />
        <Route path="/exams"               element={<ExaminationArchive />} />
        <Route path="/graduation-projects" element={<GraduationProjectReview />} />

        <Route element={<RequireSuperAdmin />}>
          <Route path="/create-admin" element={<CreateAdmin />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;