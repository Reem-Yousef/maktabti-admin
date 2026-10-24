import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function ChangePassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (form.next !== form.confirm) {
      setError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }
    if (form.next.length < 6) {
      setError('كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل');
      return;
    }
    if (form.current === form.next) {
      setError('كلمة المرور الجديدة يجب أن تختلف عن الحالية');
      return;
    }

    setLoading(true);

    // محاكاة الاتصال بالسيرفر وتغيير كلمة المرور
    setTimeout(() => {
      setLoading(false);
      navigate('/', { replace: true });
    }, 600);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-app-bg px-4">
      <div className="w-full max-w-sm rounded-2xl bg-auth-card p-8 shadow-xl shadow-navy/10">

        <div className="text-center">
          <h1 className="gradient-text text-2xl font-extrabold">Maktabati</h1>
          <p className="mt-1 text-xs text-navy/50">تغيير كلمة المرور</p>
        </div>

        <p className="mt-4 rounded-lg bg-status-orange-bg px-3 py-2 text-xs font-medium text-status-orange text-center">
          أول تسجيل دخول — يجب تغيير كلمة المرور قبل المتابعة
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">

          {/* كلمة المرور الحالية */}
          <div>
            <label className="text-xs font-semibold text-navy/70">كلمة المرور الحالية (المؤقتة)</label>
            <div className="relative mt-1.5">
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                value={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.value })}
                placeholder="كلمة المرور المؤقتة من البريد"
                className="w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 pr-10 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
              />
              <button type="button" onClick={() => setShowCurrent((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70">
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* كلمة المرور الجديدة */}
          <div>
            <label className="text-xs font-semibold text-navy/70">كلمة المرور الجديدة</label>
            <div className="relative mt-1.5">
              <input
                type={showNext ? 'text' : 'password'}
                required
                value={form.next}
                onChange={(e) => setForm({ ...form, next: e.target.value })}
                placeholder="6 أحرف على الأقل"
                className="w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 pr-10 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
              />
              <button type="button" onClick={() => setShowNext((p) => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-navy/40 hover:text-navy/70">
                {showNext ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="text-xs font-semibold text-navy/70">تأكيد كلمة المرور الجديدة</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={(e) => setForm({ ...form, confirm: e.target.value })}
              placeholder="أعد كتابة كلمة المرور الجديدة"
              className="mt-1.5 w-full rounded-lg border border-navy/10 bg-card px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none focus:border-teal"
            />
          </div>

          {/* Error */}
          {error && (
            <p className="rounded-lg bg-status-red-bg px-3 py-2 text-xs font-medium text-status-red">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 transition-opacity disabled:opacity-60"
          >
            {loading ? 'جاري الحفظ…' : 'تغيير كلمة المرور'}
          </button>
        </form>
      </div>
    </div>
  );
}