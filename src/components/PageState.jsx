// Loading / Error / Empty states — بتتحط في أي صفحة بدل ما يتكرر الكود
export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal border-t-transparent" />
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl bg-status-red-bg py-14 text-center">
      <p className="text-sm font-semibold text-status-red">⚠️ {message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 rounded-lg bg-status-red px-5 py-2 text-xs font-semibold text-white"
        >
          حاول مجدداً
        </button>
      )}
    </div>
  );
}

export function EmptyState({ message = 'لا توجد بيانات' }) {
  return (
    <p className="py-12 text-center text-sm text-navy/40">{message}</p>
  );
}
