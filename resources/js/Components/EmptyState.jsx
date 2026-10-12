import { Link } from '@inertiajs/react';

export default function EmptyState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9 12h6m-3-3v6M4.5 12a7.5 7.5 0 1115 0 7.5 7.5 0 01-15 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600 mb-1">No tickets yet</h3>
            <p className="text-gray-400 mb-6">You haven't filed any support tickets. Create one to get started.</p>
            <Link
                href={route('tickets.create')}
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
            >
                Create your first ticket
            </Link>
        </div>
    );
}
