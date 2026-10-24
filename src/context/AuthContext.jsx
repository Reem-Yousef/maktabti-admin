import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// ── يوزر وهمي بصلاحيات أدمن عشان نفتح بيه لوحة التحكم ──
const MOCK_USER = {
  id: 'mock-admin-123',
  name: 'Admin (Static)',
  email: 'admin@maktabti.com',
  role: 'superAdmin',
  rawRole: 'admin',
  isSuperAdmin: true,
};

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    // لو لقينا التوكن الوهمي اللي حطيناه في صفحة اللوجن، هنرجع اليوزر الوهمي فوراً
    if (localStorage.getItem('token')) {
      return MOCK_USER;
    }
    return null;
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    
    // محاكاة عملية اللوجن لو في أي صفحة تانية لسه بتنادي عليها
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem('token', 'dummy-static-token-123');
        setSession(MOCK_USER);
        setLoading(false);
        resolve({ ...MOCK_USER, isFirstLogin: false });
      }, 400);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setSession(null);
    window.location.href = '/login';
  }, []);

  const clearError = useCallback(() => setError(null), []);

  const isSuperAdmin = session?.role === 'superAdmin';

  return (
    <AuthContext.Provider value={{
      session, login, logout,
      isSuperAdmin, loading, error, clearError,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}