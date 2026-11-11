import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Library, FileText,
  GraduationCap, FolderOpen, UserPlus, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BASE_NAV = [
  { to: '/',                    label: 'لوحة التحكم',       icon: LayoutDashboard },
  { to: '/materials',           label: 'إدارة المواد',      icon: Library },
  { to: '/categories',          label: 'الأقسام',           icon: FolderOpen },
  { to: '/exams',               label: 'أرشيف الامتحانات',  icon: FileText },
  { to: '/graduation-projects', label: 'مشاريع التخرج',     icon: GraduationCap },
];

const SUPER_ADMIN_NAV = [
  { to: '/create-admin', label: 'إنشاء حساب Admin', icon: UserPlus },
];

export default function Sidebar({ open, onClose }) {
  const { isSuperAdmin } = useAuth();
  const NAV_ITEMS = isSuperAdmin ? [...BASE_NAV, ...SUPER_ADMIN_NAV] : BASE_NAV;

  // التعديل الأول: استبدال sm بـ lg هنا
  const sidebarClasses = `fixed inset-y-0 start-0 z-50 w-72 max-w-full transform overflow-x-hidden overflow-y-auto bg-navy px-4 py-6 transition-transform duration-200 lg:relative lg:translate-x-0 lg:w-64 ${
    open ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
  }`;

  return (
    <aside className={sidebarClasses}>
      {/* التعديل الثاني: استبدال sm بـ lg في justify-start */}
      <div className="flex items-center justify-between px-2 pb-6 lg:justify-start">
        <div>
          <p className="text-xl font-extrabold text-white">مكتبتي</p>
          <p className="text-xs font-medium text-white/40">لوحة الإدارة</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          // {/* التعديل الثالث: استبدال sm بـ lg لإخفاء الزرار في الشاشات الكبيرة فقط */}
          className="rounded-xl bg-white/10 p-2 text-white/80 transition hover:bg-white/20 lg:hidden"
        >
          <X size={16} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={() => onClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal text-white shadow-sm'
                  : 'text-white/60 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={18} strokeWidth={2} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}