import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children, widthClass = 'max-w-md' }) {
  if (!open) return null;

  return (
    // إضافة backdrop-blur-sm بتدي إحساس Premium جداً للداشبورد
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 backdrop-blur-sm px-4 py-6 transition-all">
      <div className={`w-full ${widthClass} max-h-[90vh] overflow-y-auto rounded-2xl bg-card p-5 sm:p-6 shadow-2xl`}>
        
        <div className="flex items-center justify-between gap-4 border-b border-navy/5 pb-3">
          <h2 className="text-base font-bold text-navy truncate">{title}</h2>
          <button 
            onClick={onClose} 
            className="shrink-0 rounded-lg p-1.5 text-navy/40 transition-colors hover:bg-navy/10 hover:text-status-red"
          >
            <X size={18} />
          </button>
        </div>
        
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}