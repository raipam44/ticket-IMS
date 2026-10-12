import { Link } from '@inertiajs/react';
import StatusBadge from '@/Components/StatusBadge';
import PriorityTag, { priorityStripe } from '@/Components/PriorityTag';
import { ticketNo, formatDate } from '@/lib/format';

export default function TicketTable({ tickets, onDelete }) {
    return (
        <div className="hidden md:block overflow-hidden rounded-lg border border-line bg-white">
            <table className="w-full text-sm">
                <thead className="bg-slate-50 text-left">
                    <tr>
                        <th scope="col" className="px-4 py-3 text-sm font-medium text-slate-600 w-20">No.</th>
                        <th scope="col" className="px-4 py-3 text-sm font-medium text-slate-600">Title</th>
                        <th scope="col" className="px-4 py-3 text-sm font-medium text-slate-600">Category</th>
                        <th scope="col" className="px-4 py-3 text-sm font-medium text-slate-600">Priority</th>
                        <th scope="col" className="px-4 py-3 text-sm font-medium text-slate-600">Status</th>
                        <th scope="col" className="px-4 py-3 text-sm font-medium text-slate-600">Created</th>
                        <th scope="col" className="px-4 py-3 text-sm font-medium text-slate-600 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map((ticket) => (
                        <tr key={ticket.id} className="border-t border-line hover:bg-slate-50 transition-colors duration-150">
                            {/* Priority stripe on first cell */}
                            <td className={`px-4 py-3.5 font-display font-semibold tabular-nums text-ink border-l-4 ${priorityStripe(ticket.priority)}`}>
                                {ticketNo(ticket.id)}
                            </td>
                            <td className="px-4 py-3.5 max-w-xs">
                                <Link
                                    href={route('tickets.show', ticket.id)}
                                    className="font-medium text-ink hover:text-harbor truncate block transition-colors duration-150"
                                    title={ticket.title}
                                >
                                    {ticket.title}
                                </Link>
                            </td>
                            <td className="px-4 py-3.5 text-slate-600">{ticket.category}</td>
                            <td className="px-4 py-3.5">
                                <PriorityTag priority={ticket.priority} />
                            </td>
                            <td className="px-4 py-3.5">
                                <StatusBadge status={ticket.status} />
                            </td>
                            <td className="px-4 py-3.5 text-slate-500 text-xs">
                                <time dateTime={ticket.created_at}>{formatDate(ticket.created_at)}</time>
                            </td>
                            <td className="px-4 py-3.5 text-right">
                                <div className="flex items-center justify-end gap-3">
                                    <Link
                                        href={route('tickets.show', ticket.id)}
                                        className="text-harbor hover:underline underline-offset-2 text-xs font-medium"
                                    >
                                        View
                                    </Link>
                                    <Link
                                        href={route('tickets.edit', ticket.id)}
                                        className="text-slate-600 hover:underline underline-offset-2 text-xs font-medium"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => onDelete(ticket)}
                                        className="text-red-600 hover:underline underline-offset-2 text-xs font-medium"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
