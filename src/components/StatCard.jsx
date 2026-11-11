const TONE_TEXT = {
  green: 'text-status-green',
  red: 'text-status-red',
  neutral: 'text-navy/60',
};

export default function StatCard({ label, value, delta, tone = 'neutral' }) {
  return (
    <div className="rounded-2xl bg-card px-5 py-4 shadow-sm shadow-navy/5 flex flex-col justify-center h-full">
      <p className="text-xs font-medium text-navy/50 truncate">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-navy truncate">{value}</p>
      {delta && <p className={`mt-1.5 text-xs font-medium truncate ${TONE_TEXT[tone]}`}>{delta}</p>}
    </div>
  );
}