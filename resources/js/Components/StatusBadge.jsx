// Full static class strings — Tailwind cannot detect dynamically concatenated names.
const STATUS = {
    'Open':        { pill: 'bg-sky-100 text-sky-900',         dot: 'bg-sky-500' },
    'In Progress': { pill: 'bg-amber-100 text-amber-900',     dot: 'bg-amber-500' },
    'Resolved':    { pill: 'bg-emerald-100 text-emerald-900', dot: 'bg-emerald-500' },
    'Closed':      { pill: 'bg-slate-200 text-slate-700',     dot: 'bg-slate-500' },
};

export default function StatusBadge({ status }) {
    const s = STATUS[status] ?? STATUS['Open'];
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.pill}`}>
            <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot}`} aria-hidden="true" />
            {status}
        </span>
    );
}
