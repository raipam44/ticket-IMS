import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import PriorityTag, { priorityStripe } from '@/Components/PriorityTag';
import { ticketNo, formatDate } from '@/lib/format';

export default function TicketStubCard({ ticket, onDelete }) {
    return (
        <article
            className={`md:hidden rounded-lg border border-line border-l-4 ${priorityStripe(ticket.priority)} bg-white overflow-hidden`}
        >
            {/* Stub + body row */}
            <div className="flex">
                {/* Left stub: ticket number */}
                <div className="w-20 shrink-0 border-r border-dashed border-line p-3 flex flex-col items-center justify-center bg-slate-50">
                    <span className="font-display font-semibold tabular-nums text-sm text-ink leading-none">
                        {ticketNo(ticket.id)}
                    </span>
                </div>

                {/* Right body */}
                <div className="flex-1 min-w-0 p-3 space-y-1.5">
                    <Link
                        href={route('tickets.show', ticket.id)}
                        className="block font-medium text-sm text-ink hover:text-harbor line-clamp-2 break-words leading-snug transition-colors duration-150"
                    >
                        {ticket.title}
                    </Link>
                    <p className="text-xs text-slate-500">{ticket.category}</p>
                    <div className="flex flex-wrap items-center gap-2">
                        <PriorityTag priority={ticket.priority} />
                        <StatusBadge status={ticket.status} />
                    </div>
                    <p className="text-xs text-slate-400">
                        <time dateTime={ticket.created_at}>{formatDate(ticket.created_at)}</time>
                    </p>
                </div>
            </div>

            {/* Footer actions */}
            <div className="grid grid-cols-3 border-t border-line divide-x divide-line">
                <Link
                    href={route('tickets.show', ticket.id)}
                    className="flex items-center justify-center min-h-11 text-xs font-medium text-harbor hover:bg-slate-50 transition-colors duration-150"
                >
                    View
                </Link>
                <Link
                    href={route('tickets.edit', ticket.id)}
                    className="flex items-center justify-center min-h-11 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-150"
                >
                    Edit
                </Link>
                <button
                    onClick={() => onDelete(ticket)}
                    className="flex items-center justify-center min-h-11 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                    Delete
                </button>
            </div>
        </article>
    );
}
