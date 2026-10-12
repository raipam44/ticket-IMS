import { Link } from '@inertiajs/react';

export default function EmptyState({ filtered = false, onClearFilters }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
            {/* Inbox icon */}
            <svg
                className="h-14 w-14 text-slate-300 mb-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                aria-hidden="true"
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 13.5h3.86a2.25 2.25 0 012.012 1.244l.256.512a2.25 2.25 0 002.013 1.244h3.218a2.25 2.25 0 002.013-1.244l.256-.512a2.25 2.25 0 012.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 00-2.15-1.588H6.911a2.25 2.25 0 00-2.15 1.588L2.35 13.177a2.25 2.25 0 00-.1.661z"
                />
            </svg>

            {filtered ? (
                <>
                    <h3 className="font-display text-lg font-semibold text-ink mb-1">No tickets match these filters</h3>
                    <p className="text-slate-500 text-sm mb-6">Try adjusting or removing your filters to see your tickets.</p>
                    <button
                        onClick={onClearFilters}
                        className="inline-flex items-center px-4 py-2 rounded-md border border-line bg-white text-ink text-sm font-medium hover:bg-slate-50 transition-colors duration-150"
                    >
                        Clear filters
                    </button>
                </>
            ) : (
                <>
                    <h3 className="font-display text-lg font-semibold text-ink mb-1">No tickets yet</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-xs">
                        When you report an issue, it shows up here so you can follow it to resolution.
                    </p>
                    <Link
                        href={route('tickets.create')}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-harbor text-white text-sm font-medium hover:bg-harbor-dark transition-colors duration-150"
                    >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Create ticket
                    </Link>
                </>
            )}
        </div>
    );
}
