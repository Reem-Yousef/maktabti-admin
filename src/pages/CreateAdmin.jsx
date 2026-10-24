import { useState } from 'react';
import Topbar from '../components/Topbar';

const EMPTY = { fullName: '', universityEmail: '', phoneNumber: '' };
const EMPTY_ERRORS = { fullName: '', universityEmail: '', phoneNumber: '' };

const phoneRegex = /^(\+20|0)?1[0125]\d{8}$/;

export default function CreateAdmin() {
  const [form, setForm]         = useState(EMPTY);
  const [errors, setErrors]     = useState(EMPTY_ERRORS);
  const [loading, setLoading]   = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess]   = useState('');

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
        return value.trim().length < 3 ? 'الاسم يجب أن يكون 3 أحرف على الأقل' : '';
      case 'universityEmail':
        return !value.trim() ? 'البريد الإلكتروني مطلوب' : '';
      case 'phoneNumber':
        return !phoneRegex.test(value.trim())
          ? 'رقم الهاتف غير صحيح — مثال: 01012345678'
          : '';
      default:
        return '';
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: prev[name] ? validateField(name, value) : '',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setApiError('');
    setSuccess('');

    const newErrors = {
      fullName:        validateField('fullName',        form.fullName),
      universityEmail: validateField('universityEmail', form.universityEmail),
      phoneNumber:     validateField('phoneNumber',     form.phoneNumber),
    };
    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    setLoading(true);

    // محاكاة إرسال البيانات للسيرفر
    setTimeout(() => {
      // تجربة وهمية لحالة الإيرور
      if (form.universityEmail === 'admin@admin.com') {
        setApiError('هذا البريد مسجل بالفعل (تجربة للخطأ)');
        setLoading(false);
        return;
      }

      setSuccess(
        `✅ تم إنشاء حساب ${form.fullName} بنجاح! تم إرسال بيانات الدخول لـ ${form.universityEmail}`
      );
      setForm(EMPTY);
      setErrors(EMPTY_ERRORS);
      setLoading(false);
    }, 600);
  };

  return (
    <div>
      <Topbar title="إنشاء حساب Admin" />

      <div className="mx-auto mt-6 max-w-lg rounded-2xl bg-card p-8 shadow-sm">

        <h2 className="mb-1 text-base font-semibold text-navy">إنشاء حساب Admin جديد</h2>
        <p className="mb-6 text-xs text-text-hint">
          سيتم إنشاء كلمة مرور عشوائية وإرسالها للبريد الإلكتروني تلقائياً
        </p>

        {success && (
          <div className="mb-4 rounded-lg bg-status-green-bg px-4 py-3 text-xs font-medium text-status-green">
            {success}
          </div>
        )}

        {apiError && (
          <div className="mb-4 rounded-lg bg-status-red-bg px-4 py-3 text-xs font-medium text-status-red">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* الاسم */}
          <div>
            <label className="text-xs font-semibold text-navy/70">
              الاسم الكامل <span className="text-status-red">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="أحمد محمود"
              className={`mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none transition-colors
                ${errors.fullName
                  ? 'border-status-red bg-status-red-bg focus:border-status-red'
                  : 'border-navy/10 bg-app-bg focus:border-teal'
                }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-status-red">{errors.fullName}</p>
            )}
          </div>

          {/* البريد */}
          <div>
            <label className="text-xs font-semibold text-navy/70">
              البريد الإلكتروني <span className="text-status-red">*</span>
            </label>
            <input
              type="email"
              name="universityEmail"
              value={form.universityEmail}
              onChange={handleChange}
              placeholder="admin@email.com"
              className={`mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none transition-colors
                ${errors.universityEmail
                  ? 'border-status-red bg-status-red-bg focus:border-status-red'
                  : 'border-navy/10 bg-app-bg focus:border-teal'
                }`}
            />
            {errors.universityEmail && (
              <p className="mt-1 text-xs text-status-red">{errors.universityEmail}</p>
            )}
            <p className="mt-1 text-xs text-text-hint">البريد فريد — لا يمكن تسجيل نفس البريد مرتين</p>
          </div>

          {/* الهاتف */}
          <div>
            <label className="text-xs font-semibold text-navy/70">
              رقم الهاتف <span className="text-status-red">*</span>
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleChange}
              placeholder="01012345678"
              className={`mt-1.5 w-full rounded-lg border px-3 py-2.5 text-sm text-navy placeholder:text-text-hint outline-none transition-colors
                ${errors.phoneNumber
                  ? 'border-status-red bg-status-red-bg focus:border-status-red'
                  : 'border-navy/10 bg-app-bg focus:border-teal'
                }`}
            />
            {errors.phoneNumber && (
              <p className="mt-1 text-xs text-status-red">{errors.phoneNumber}</p>
            )}
          </div>

          {/* Info box */}
          <div className="rounded-lg bg-status-blue-bg px-4 py-3 text-xs text-status-blue space-y-1">
            <p>✅ سيتم إنشاء كلمة مرور عشوائية قوية تلقائياً</p>
            <p>✅ سيتم إرسال بيانات الدخول للبريد الإلكتروني</p>
            <p>✅ Admin الجديد سيضطر لتغيير الكلمة عند أول دخول</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gradient-primary w-full rounded-lg py-2.5 text-sm font-semibold text-white shadow-md shadow-navy/20 transition-opacity disabled:opacity-60"
          >
            {loading ? 'جاري الإنشاء...' : 'إنشاء حساب Admin'}
          </button>

        </form>
      </div>
    </div>
  );
}