const TONE_STYLES = {
  green: 'bg-status-green-bg text-status-green',
  red: 'bg-status-red-bg text-status-red',
  orange: 'bg-status-orange-bg text-status-orange',
  blue: 'bg-status-blue-bg text-status-blue',
  purple: 'bg-status-purple-bg text-status-purple',
  navy: 'bg-navy/10 text-navy',
  gray: 'bg-status-gray-bg text-status-gray',
};

export default function StatusBadge({ tone = 'navy', children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${TONE_STYLES[tone] || TONE_STYLES.navy}`}
    >
      {children}
    </span>
  );
}
