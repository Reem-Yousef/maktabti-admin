import { createContext, useContext, useState, useCallback } from 'react';
import { apiClient } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => {
    try {
      const saved = localStorage.getItem('auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  // ── Login ─────────────────────────────────────────────────────────────────
  // POST /api/auth/login
  // Body:     { universityEmail, password }
  // Response: { success, token, user: { id, fullName, universityEmail, role, ... } }
  const login = useCallback(async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await apiClient.post('/auth/login', {
        universityEmail: email,
        password,
      });

      // role check — الـ portal للـ admin فقط
      if (data.user.role !== 'admin') {
        throw new Error('ليس لديك صلاحية للدخول على هذا النظام');
      }

      if (rememberMe) {
        localStorage.setItem('auth_token', data.token);
      } else {
        sessionStorage.setItem('auth_token', data.token);
      }

      // نفك الـ token عشان نجيب isSuperAdmin
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));

      const userSession = {
        id:           data.user.id,
        name:         data.user.fullName,
        email:        data.user.universityEmail,
        role:         tokenPayload.isSuperAdmin ? 'superAdmin' : 'admin',
        rawRole:      data.user.role,
        major:        data.user.academicMajor,
        year:         data.user.academicYear,
        isSuperAdmin: tokenPayload.isSuperAdmin ?? false,
      };

      localStorage.setItem('auth_user', JSON.stringify(userSession));
      setSession(userSession);

      // رجّعي isFirstLogin عشان Login.jsx يتصرف
      return { ...userSession, isFirstLogin: data.isFirstLogin ?? false };

    } catch (err) {
      const msg =
        err.message && !err.response
        ? err.message
        : err.response?.data?.message || 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Logout ────────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    sessionStorage.removeItem('auth_token');
    setSession(null);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // الـ portal بيعتبر admin = superAdmin
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
