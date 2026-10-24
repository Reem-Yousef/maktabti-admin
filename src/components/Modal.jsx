import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, widthClass = 'max-w-md' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 px-4 py-6">
      <div className={`w-full max-w-full ${widthClass} max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-6 shadow-2xl`}>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-navy">{title}</h2>
          <button onClick={onClose} className="text-navy/40 hover:text-navy">
            <X size={18} />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
