// Full static class strings — Tailwind cannot detect dynamically concatenated names.
const PRIORITY = {
    'Low':    { bars: 1, bar: 'bg-slate-400',  text: 'text-slate-700',             stripe: 'border-l-slate-400' },
    'Medium': { bars: 2, bar: 'bg-indigo-500', text: 'text-indigo-800',            stripe: 'border-l-indigo-500' },
    'High':   { bars: 3, bar: 'bg-orange-500', text: 'text-orange-800',            stripe: 'border-l-orange-500' },
    'Urgent': { bars: 4, bar: 'bg-red-600',    text: 'text-red-800 font-semibold', stripe: 'border-l-red-600' },
};

// Fixed heights for bars 1-4 so no inline styles are needed.
const BAR_HEIGHTS = ['h-2', 'h-3', 'h-4', 'h-5'];

export default function PriorityTag({ priority }) {
    const p = PRIORITY[priority] ?? PRIORITY['Low'];
    return (
        <span className={`inline-flex items-center gap-1.5 text-sm ${p.text}`}>
            <span className="flex items-end gap-0.5" aria-hidden="true">
                {[0, 1, 2, 3].map((i) => (
                    <span
                        key={i}
                        className={`w-1 rounded-sm ${BAR_HEIGHTS[i]} ${i < p.bars ? p.bar : 'bg-slate-200'}`}
                    />
                ))}
            </span>
            {priority}
        </span>
    );
}

// Export the stripe lookup so table/card wrappers can apply the left-edge color.
export const priorityStripe = (priority) =>
    PRIORITY[priority]?.stripe ?? PRIORITY['Low'].stripe;
