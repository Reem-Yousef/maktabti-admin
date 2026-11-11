import { useState } from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Topbar({ title, action }) {
  const { session, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const handleMenuClick = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-sidebar'));
    }
  };

  return (
    // التعديل الأول: ضبط الـ Flexbox عشان العناصر تاخد مساحتها بشكل مرن بدون تشوه
    <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center justify-between">
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleMenuClick}
          // التعديل الثاني: استخدام lg:hidden عشان الزرار يفضل ظاهر في التابلت والموبايل
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-card text-navy/80 transition hover:bg-navy/5 lg:hidden"
        >
          <span className="sr-only">فتح القائمة</span>
          <Menu size={18} />
        </button>

        <h1 className="text-xl sm:text-2xl font-bold text-navy truncate">{title}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* الحفاظ على زرار الأكشن من إنه ينكسر على سطرين */}
        {action && <div className="shrink-0">{action}</div>}

        <div className="relative shrink-0">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full bg-card px-3 py-1.5 shadow-sm shadow-navy/5 transition-colors hover:bg-card/80"
          >
            {/* تقصير النص الطويل عشان ما يبوظش التصميم */}
            <span className="text-sm font-medium text-navy truncate max-w-[120px] sm:max-w-[150px] whitespace-nowrap">
              {session?.name ?? 'Admin'}
            </span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
              {session?.name?.[0] ?? 'A'}
            </span>
          </button>

          {open && (
            // التعديل الثالث: استخدام start-0 بدل right-0 عشان القائمة تظهر صح في الـ RTL
            <div className="absolute start-0 z-10 mt-2 w-44 overflow-hidden rounded-xl bg-card shadow-lg shadow-navy/10 border border-navy/5">
              <div className="border-b border-navy/5 px-3 py-2">
                <p className="text-xs font-medium text-navy/50">
                  {session?.role === 'superAdmin' ? 'مدير النظام' : 'مشرف'}
                </p>
              </div>
              <button
                onClick={logout}
                // التعديل الرابع: text-start بدل text-left
                className="flex w-full items-center gap-2 px-3 py-2.5 text-start text-sm font-medium text-status-red hover:bg-status-red-bg transition-colors"
              >
                <LogOut size={16} className="shrink-0" />
                تسجيل الخروج
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}