const config = {
  active:    { label: 'Active',     dot: 'bg-green-400',  bg: 'bg-green-400/15',  text: 'text-green-400',  border: 'border-green-400/25' },
  at_risk:   { label: 'At Risk',    dot: 'bg-amber-400',  bg: 'bg-amber-400/15',  text: 'text-amber-400',  border: 'border-amber-400/25' },
  completed: { label: 'Completed',  dot: 'bg-slate-400',  bg: 'bg-slate-400/15',  text: 'text-slate-400',  border: 'border-slate-400/25' },
};

export default function StatusBadge({ status, pulse = false }) {
  const c = config[status] || config.active;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${c.bg} ${c.text} ${c.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot} ${pulse && status === 'at_risk' ? 'animate-pulse' : ''}`} />
      {c.label}
    </span>
  );
}