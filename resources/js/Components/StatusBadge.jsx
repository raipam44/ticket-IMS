const STATUS_CLASSES = {
    'Open':        'bg-green-100 text-green-700',
    'In Progress': 'bg-yellow-100 text-yellow-800',
    'Resolved':    'bg-indigo-100 text-indigo-700',
    'Closed':      'bg-gray-200 text-gray-600',
};

export default function StatusBadge({ status }) {
    const classes = STATUS_CLASSES[status] ?? 'bg-gray-100 text-gray-700';
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${classes}`}>
            {status}
        </span>
    );
}
