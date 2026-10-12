import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PriorityTag, { priorityStripe } from '@/Components/PriorityTag';
import StatusBadge from '@/Components/StatusBadge';
import { ticketNo, formatDate } from '@/lib/format';

const STATUS_STYLE = {
    'Open':        'bg-sky-50 border-sky-200 text-sky-700',
    'In Progress': 'bg-amber-50 border-amber-200 text-amber-700',
    'Resolved':    'bg-emerald-50 border-emerald-200 text-emerald-700',
    'Closed':      'bg-slate-50 border-slate-200 text-slate-600',
};

const STATUSES = ['Open', 'In Progress', 'Resolved', 'Closed'];

export default function Dashboard({ counts, recent }) {
    return (
        <AuthenticatedLayout>
            <Head title="Your queue" />

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">Your queue</h1>
                <Link
                    href={route('tickets.create')}
                    className="inline-flex items-center gap-1.5 rounded-md bg-harbor text-white text-sm font-medium min-h-11 sm:min-h-10 px-4 hover:bg-harbor-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 transition-colors duration-150"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    New ticket
                </Link>
            </div>

            {/* Status counter cards — 2×2 on phone, 4 across on lg */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                {STATUSES.map((status) => (
                    <Link
                        key={status}
                        href={route('tickets.index', { status })}
                        className={`rounded-lg border p-4 sm:p-5 text-center hover:shadow-sm transition-shadow duration-150 ${STATUS_STYLE[status]}`}
                    >
                        <p className="font-display text-3xl font-bold">{counts[status] ?? 0}</p>
                        <p className="text-sm font-medium mt-1">{status}</p>
                    </Link>
                ))}
            </div>

            {/* Recent tickets */}
            <div className="bg-white rounded-lg border border-line overflow-hidden">
                <div className="flex items-center justify-between px-5 py-4 border-b border-line">
                    <h2 className="font-display text-lg font-semibold text-ink">Recent tickets</h2>
                    <Link
                        href={route('tickets.index')}
                        className="text-sm text-harbor hover:underline underline-offset-2 transition-colors duration-150"
                    >
                        View all tickets →
                    </Link>
                </div>

                {recent.length === 0 ? (
                    <div className="px-5 py-10 text-center text-slate-400 text-sm">
                        No tickets yet.{' '}
                        <Link href={route('tickets.create')} className="text-harbor hover:underline">
                            Create one
                        </Link>
                        .
                    </div>
                ) : (
                    <ul className="divide-y divide-line">
                        {recent.map((ticket) => (
                            <li key={ticket.id}>
                                <Link
                                    href={route('tickets.show', ticket.id)}
                                    className={`flex items-center gap-4 px-0 py-3.5 hover:bg-slate-50 transition-colors duration-150 border-l-4 ${priorityStripe(ticket.priority)}`}
                                >
                                    <span className="font-display font-semibold tabular-nums text-sm text-ink w-16 text-center shrink-0">
                                        {ticketNo(ticket.id)}
                                    </span>
                                    <span className="flex-1 min-w-0">
                                        <span className="block text-sm font-medium text-ink truncate">{ticket.title}</span>
                                        <span className="block text-xs text-slate-400 mt-0.5">{ticket.category}</span>
                                    </span>
                                    <span className="hidden sm:flex items-center gap-2 shrink-0 pr-5">
                                        <PriorityTag priority={ticket.priority} />
                                        <StatusBadge status={ticket.status} />
                                    </span>
                                    <span className="flex sm:hidden items-center gap-1.5 shrink-0 pr-4">
                                        <StatusBadge status={ticket.status} />
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
