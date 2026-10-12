import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import PriorityBadge from '@/Components/PriorityBadge';
import StatusBadge from '@/Components/StatusBadge';

export default function Dashboard({ counts, recent }) {
    const statuses = ['Open', 'In Progress', 'Resolved', 'Closed'];
    const statusColors = {
        'Open':        'bg-green-50 border-green-200 text-green-700',
        'In Progress': 'bg-yellow-50 border-yellow-200 text-yellow-700',
        'Resolved':    'bg-indigo-50 border-indigo-200 text-indigo-700',
        'Closed':      'bg-gray-50 border-gray-200 text-gray-600',
    };

    return (
        <AuthenticatedLayout header={<h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>}>
            <Head title="Dashboard" />

            {/* Status counters */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 mb-8">
                {statuses.map((status) => (
                    <div
                        key={status}
                        className={`rounded-xl border p-4 text-center ${statusColors[status]}`}
                    >
                        <p className="text-3xl font-bold">{counts[status] ?? 0}</p>
                        <p className="text-sm font-medium mt-1">{status}</p>
                    </div>
                ))}
            </div>

            {/* Recent tickets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-700">Recent Tickets</h3>
                    <Link href={route('tickets.index')} className="text-sm text-indigo-600 hover:underline">
                        View all →
                    </Link>
                </div>

                {recent.length === 0 ? (
                    <div className="px-6 py-10 text-center text-gray-400 text-sm">
                        No tickets yet.{' '}
                        <Link href={route('tickets.create')} className="text-indigo-600 hover:underline">
                            Create one
                        </Link>
                        .
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {recent.map((ticket) => (
                            <li key={ticket.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                                <div className="min-w-0 flex-1">
                                    <Link
                                        href={route('tickets.show', ticket.id)}
                                        className="text-sm font-medium text-gray-800 hover:text-indigo-600 truncate block"
                                    >
                                        {ticket.title}
                                    </Link>
                                    <p className="text-xs text-gray-400 mt-0.5">{ticket.category}</p>
                                </div>
                                <div className="flex items-center gap-2 ml-4 shrink-0">
                                    <PriorityBadge priority={ticket.priority} />
                                    <StatusBadge status={ticket.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
