import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, X } from 'lucide-react';

const STEP_EMAIL = 'email';
const STEP_RESET = 'reset';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: '', password: '', remember: false });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');

  const [modal, setModal] = useState(null);
  const [fpEmail, setFpEmail] = useState('');
  const [fpOtp, setFpOtp] = useState('');
  const [fpNewPass, setFpNewPass] = useState('');
  const [fpConfirm, setFpConfirm] = useState('');
  const [fpLoading, setFpLoading] = useState(false);
  const [fpError, setFpError] = useState('');
  const [fpSuccess, setFpSuccess] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('error') === 'session-expired') {
      setError('الجلسة انتهت أو انتهت صلاحية الدخول. الرجاء تسجيل الدخول مرة أخرى.');
    }
  }, [location.search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // محاكاة تسجيل الدخول وتخطي الباك إند
    localStorage.setItem('token', 'dummy-static-token-123');
    navigate('/');
  };

  const openForgot = () => {
    setFpEmail('');
    setFpOtp('');
    setFpNewPass('');
    setFpConfirm('');
    setFpError('');
    setFpSuccess('');
    setModal(STEP_EMAIL);
  };

  const closeModal = () => {
    setModal(null);
    setFpError('');
    setFpSuccess('');
  };

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (!fpEmail.trim()) {
      setFpError('البريد الإلكتروني مطلوب');
      return;
    }
    setFpLoading(true);
    setFpError('');
    
    // محاكاة إرسال الكود
    setTimeout(() => {
      setFpSuccess('تم إرسال كود التحقق لبريدك الإلكتروني (عملية وهمية)');
      setModal(STEP_RESET);
      setFpLoading(false);
    }, 500);
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    setFpError('');

    if (!fpOtp.trim()) {
      setFpError('كود التحقق مطلوب');
      return;
    }
    if (fpNewPass.length < 6) {
      setFpError('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (fpNewPass !== fpConfirm) {
      setFpError('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    setFpLoading(true);
    // محاكاة تغيير الباسورد
    setTimeout(() => {
      setFpSuccess('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول.');
      setFpLoading(false);
      setTimeout(() => closeModal(), 2000);
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-sm rounded-2xl bg-auth-card p-8 shadow-xl shadow-navy/10">

        <div className="text-center">
          <h1 className="gradient-text text-2xl font-extrabold">Maktabati</h1>
          <p className="mt-1 text-xs text-navy/50">Admin Portal</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-4">
          <div>
            <label className="text-xs font-semibold text-navy/70"> Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="admin@email.com"
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-navy/70">Password</label>
            <div className="relative mt-1.5">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 pr-10 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="rounded-lg bg-status-red-bg px-3 py-2 text-xs font-medium text-status-red">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-navy/60">
              <input
                type="checkbox"
                checked={form.remember}
                onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                className="accent-teal"
              />
              Remember me
            </label>
            <button type="button" onClick={openForgot}
              className="font-semibold text-teal hover:underline">
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 transition-opacity disabled:opacity-60"
          >
            Sign In
          </button>
        </form>
      </div>

      {/* ── Forgot Password Modal ──────────────────────────────────────────── */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/30 px-4 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-auth-card p-6 shadow-xl shadow-navy/20">

            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold text-navy">
                {modal === STEP_EMAIL ? 'نسيت كلمة المرور؟' : 'إعادة تعيين كلمة المرور'}
              </h2>
              <button onClick={closeModal}
                className="rounded-lg p-1 text-navy/40 hover:bg-navy/5 hover:text-navy">
                <X size={16} />
              </button>
            </div>

            {fpSuccess && (
              <p className="mb-3 rounded-lg bg-status-green-bg px-3 py-2 text-xs font-medium text-status-green">
                {fpSuccess}
              </p>
            )}

            {fpError && (
              <p className="mb-3 rounded-lg bg-status-red-bg px-3 py-2 text-xs font-medium text-status-red">
                {fpError}
              </p>
            )}

            {modal === STEP_EMAIL && (
              <form onSubmit={handleSendOtp} className="space-y-3">
                <p className="text-xs text-navy/60">
                  أدخل بريدك الإلكتروني وسنرسل لك كود التحقق
                </p>
                <div>
                  <label className="text-xs font-semibold text-navy/70">البريد الإلكتروني</label>
                  <input
                    type="email"
                    required
                    value={fpEmail}
                    onChange={(e) => setFpEmail(e.target.value)}
                    placeholder="example@email.com"
                    className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
                  />
                </div>
                <button
                  type="submit"
                  disabled={fpLoading}
                  className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 disabled:opacity-60"
                >
                  {fpLoading ? 'جاري الإرسال...' : 'إرسال كود التحقق'}
                </button>
              </form>
            )}

            {modal === STEP_RESET && (
              <form onSubmit={handleResetPassword} className="space-y-3">
                <p className="text-xs text-navy/60">
                  أدخل الكود الذي وصلك على <span className="font-semibold text-navy">{fpEmail}</span>
                </p>

                <div>
                  <label className="text-xs font-semibold text-navy/70">كود التحقق (OTP)</label>
                  <input
                    type="text"
                    required
                    value={fpOtp}
                    onChange={(e) => setFpOtp(e.target.value)}
                    placeholder="123456"
                    maxLength={6}
                    className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal tracking-widest text-center"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy/70">كلمة المرور الجديدة</label>
                  <input
                    type="password"
                    required
                    value={fpNewPass}
                    onChange={(e) => setFpNewPass(e.target.value)}
                    placeholder="6 أحرف على الأقل"
                    className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-navy/70">تأكيد كلمة المرور</label>
                  <input
                    type="password"
                    required
                    value={fpConfirm}
                    onChange={(e) => setFpConfirm(e.target.value)}
                    placeholder="أعد كتابة كلمة المرور"
                    className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setModal(STEP_EMAIL); setFpError(''); setFpSuccess(''); }}
                    className="flex-1 rounded-lg border border-navy/10 py-2.5 text-xs font-semibold text-navy/60 hover:bg-navy/5"
                  >
                    رجوع
                  </button>
                  <button
                    type="submit"
                    disabled={fpLoading}
                    className="gradient-primary flex-1 rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 disabled:opacity-60"
                  >
                    {fpLoading ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={fpLoading}
                  className="w-full text-center text-xs text-teal hover:underline disabled:opacity-50"
                >
                  لم يصلك الكود؟ إعادة إرسال
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}