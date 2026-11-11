export function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
      <p className="text-xs font-medium text-navy/50">جاري التحميل...</p>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-status-red-bg py-14 px-4 text-center">
      <div className="flex items-center gap-2 text-status-red">
        <span className="text-lg leading-none mt-0.5">⚠️</span>
        <p className="text-sm font-semibold">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-status-red px-6 py-2.5 text-xs font-semibold text-white shadow-md shadow-status-red/20 transition-opacity hover:opacity-90 active:scale-95"
        >
          حاول مجدداً
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'لا توجد بيانات' }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 opacity-70">
      <span className="text-4xl mb-3 grayscale">📭</span>
      <p className="text-sm font-medium text-navy">{message}</p>
    </div>
  );
}