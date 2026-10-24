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
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleMenuClick}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-card text-navy/80 transition hover:bg-navy/5 sm:hidden"
        >
          <span className="sr-only">Open navigation</span>
          <Menu size={18} />
        </button>

        <h1 className="text-2xl font-bold text-navy">{title}</h1>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
        {action}

        <div className="relative">
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 rounded-full bg-card px-4 py-1.5 shadow-sm shadow-navy/5"
          >
            <span className="text-sm font-medium text-navy">
              {session?.name ?? 'Admin'} ({session?.role === 'superAdmin' ? 'Admin' : 'Supervisor'})
            </span>
            <span className="flex h-7 w-7 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
              {session?.name?.[0] ?? 'A'}
            </span>
          </button>

          {open && (
            <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl bg-card shadow-lg shadow-navy/10">
              <div className="border-b border-navy/5 px-3 py-2">
                <p className="text-xs font-medium text-navy/50">
                  {session?.role === 'superAdmin' ? 'Super Admin' : 'Supervisor'}
                </p>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-status-red hover:bg-status-red-bg"
              >
                <LogOut size={14} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
