import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import StatusBadge from '@/Components/StatusBadge';
import PriorityTag, { priorityStripe } from '@/Components/PriorityTag';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';
import { ticketNo, formatDateTime } from '@/lib/format';

export default function Show({ ticket }) {
    const [showDelete, setShowDelete] = useState(false);

    const handleDelete = () => {
        router.delete(route('tickets.destroy', ticket.id));
    };

    return (
        <AuthenticatedLayout>
            <Head title={ticket.title} />

            {/* Back link */}
            <Link
                href={route('tickets.index')}
                className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-harbor transition-colors duration-150 mb-4"
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Back to tickets
            </Link>

            <div className={`max-w-2xl bg-white rounded-lg border border-line border-l-4 ${priorityStripe(ticket.priority)} overflow-hidden`}>
                <div className="p-5 sm:p-6 space-y-5">

                    {/* Ticket number + title + actions row */}
                    <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                            <p className="font-display font-semibold tabular-nums text-sm text-slate-500 mb-1">
                                {ticketNo(ticket.id)}
                            </p>
                            <h1 className="font-display text-2xl font-bold text-ink break-words leading-snug">
                                {ticket.title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 pt-1">
                            <Link
                                href={route('tickets.edit', ticket.id)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-line bg-white text-ink text-sm font-medium min-h-10 px-3 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 transition-colors duration-150"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
                                </svg>
                                Edit ticket
                            </Link>
                            <button
                                onClick={() => setShowDelete(true)}
                                className="inline-flex items-center gap-1.5 rounded-md border border-red-200 bg-white text-red-600 text-sm font-medium min-h-10 px-3 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 transition-colors duration-150"
                            >
                                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                </svg>
                                Delete
                            </button>
                        </div>
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-3">
                        <StatusBadge status={ticket.status} />
                        <PriorityTag priority={ticket.priority} />
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                            {ticket.category}
                        </span>
                    </div>

                    {/* Timestamps */}
                    <p className="text-xs text-slate-400">
                        Opened{' '}
                        <time dateTime={ticket.created_at}>{formatDateTime(ticket.created_at)}</time>
                        {ticket.updated_at !== ticket.created_at && (
                            <>
                                {' · '}Last updated{' '}
                                <time dateTime={ticket.updated_at}>{formatDateTime(ticket.updated_at)}</time>
                            </>
                        )}
                    </p>

                    {/* Description */}
                    <div>
                        <h2 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Description</h2>
                        <div className="rounded-md bg-paper border border-line p-4 text-sm text-ink leading-relaxed whitespace-pre-line max-w-prose">
                            {ticket.description}
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmDeleteModal
                show={showDelete}
                ticket={ticket}
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
            />
        </AuthenticatedLayout>
    );
}
