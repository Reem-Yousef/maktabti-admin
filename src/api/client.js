import axios from 'axios';

// ─────────────────────────────────────────────────────────────────────────────
// Axios instance — كل الـ requests بتعدي من هنا
// Base URL: https://maktabti-backend-v2-production.up.railway.app/api
// ─────────────────────────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL:
    import.meta.env.VITE_API_BASE_URL ||
    'https://maktabti-backend-v2-production.up.railway.app/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Request interceptor ───────────────────────────────────────────────────────
// بيضيف الـ JWT token تلقائياً في كل request
apiClient.interceptors.request.use((config) => {
const token = localStorage.getItem('auth_token') || sessionStorage.getItem('auth_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── Response interceptor ──────────────────────────────────────────────────────
// لو الـ token انتهى أو اتمسح → يطلع للـ login تلقائياً
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    const url = error.config?.url ?? '';
      const isAuthEndpoint = url.includes('/auth/');
      if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('auth_token');
      sessionStorage.removeItem('auth_token');      localStorage.removeItem('auth_user');
      window.dispatchEvent(new CustomEvent('auth-logout', {
        detail: { reason: 'session-expired' },
      }));
    }
    return Promise.reject(error);
  }
);
