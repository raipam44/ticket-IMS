const PRIORITY_CLASSES = {
    Low:    'bg-gray-100 text-gray-700',
    Medium: 'bg-blue-100 text-blue-700',
    High:   'bg-orange-100 text-orange-700',
    Urgent: 'bg-red-100 text-red-700',
};

export default function PriorityBadge({ priority }) {
    const classes = PRIORITY_CLASSES[priority] ?? 'bg-gray-100 text-gray-700';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
            {priority}
        </span>
    );
}
