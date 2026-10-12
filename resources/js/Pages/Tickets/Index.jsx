import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PriorityBadge from '@/Components/PriorityBadge';
import StatusBadge from '@/Components/StatusBadge';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function Index({ tickets, filters, options }) {
    const [deleteId, setDeleteId] = useState(null);
    const [localFilters, setLocalFilters] = useState({
        status:   filters.status   ?? '',
        priority: filters.priority ?? '',
        category: filters.category ?? '',
        search:   filters.search   ?? '',
    });

    const applyFilters = (updated) => {
        const merged = { ...localFilters, ...updated };
        setLocalFilters(merged);
        const params = Object.fromEntries(
            Object.entries(merged).filter(([, v]) => v !== '')
        );
        router.get(route('tickets.index'), params, { preserveState: true, replace: true });
    };

    const confirmDelete = (id) => setDeleteId(id);
    const cancelDelete  = () => setDeleteId(null);
    const handleDelete  = () => {
        if (!deleteId) return;
        router.delete(route('tickets.destroy', deleteId), {
            onFinish: () => setDeleteId(null),
        });
    };

    const data = tickets.data ?? [];

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">My Tickets</h2>
                <Link
                    href={route('tickets.create')}
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                >
                    + New Ticket
                </Link>
            </div>
        }>
            <Head title="My Tickets" />

            {/* Filters */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <input
                        type="text"
                        placeholder="Search by title…"
                        value={localFilters.search}
                        onChange={(e) => applyFilters({ search: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <select
                        value={localFilters.status}
                        onChange={(e) => applyFilters({ status: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All statuses</option>
                        {options.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        value={localFilters.priority}
                        onChange={(e) => applyFilters({ priority: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All priorities</option>
                        {options.priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                        value={localFilters.category}
                        onChange={(e) => applyFilters({ category: e.target.value })}
                        className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All categories</option>
                        {options.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>

            {data.length === 0 ? (
                <EmptyState />
            ) : (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    {/* Desktop table */}
                    <table className="hidden md:table w-full text-sm">
                        <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
                            <tr>
                                <th className="px-6 py-3 text-left">Title</th>
                                <th className="px-4 py-3 text-left">Category</th>
                                <th className="px-4 py-3 text-left">Priority</th>
                                <th className="px-4 py-3 text-left">Status</th>
                                <th className="px-4 py-3 text-left">Created</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((ticket) => (
                                <tr key={ticket.id} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 font-medium text-gray-800 max-w-xs truncate">
                                        <Link href={route('tickets.show', ticket.id)} className="hover:text-indigo-600">
                                            {ticket.title}
                                        </Link>
                                    </td>
                                    <td className="px-4 py-4 text-gray-500">{ticket.category}</td>
                                    <td className="px-4 py-4"><PriorityBadge priority={ticket.priority} /></td>
                                    <td className="px-4 py-4"><StatusBadge status={ticket.status} /></td>
                                    <td className="px-4 py-4 text-gray-400 text-xs">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={route('tickets.show', ticket.id)}
                                                className="text-xs text-indigo-600 hover:underline"
                                            >View</Link>
                                            <Link
                                                href={route('tickets.edit', ticket.id)}
                                                className="text-xs text-gray-600 hover:underline"
                                            >Edit</Link>
                                            <button
                                                onClick={() => confirmDelete(ticket.id)}
                                                className="text-xs text-red-500 hover:underline"
                                            >Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Mobile cards */}
                    <ul className="md:hidden divide-y divide-gray-100">
                        {data.map((ticket) => (
                            <li key={ticket.id} className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <Link
                                        href={route('tickets.show', ticket.id)}
                                        className="font-medium text-gray-800 hover:text-indigo-600 leading-snug"
                                    >
                                        {ticket.title}
                                    </Link>
                                    <span className="text-xs text-gray-400 shrink-0">
                                        {new Date(ticket.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mb-3">{ticket.category}</p>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2">
                                        <PriorityBadge priority={ticket.priority} />
                                        <StatusBadge status={ticket.status} />
                                    </div>
                                    <div className="flex gap-3">
                                        <Link href={route('tickets.edit', ticket.id)} className="text-xs text-gray-600 hover:underline">Edit</Link>
                                        <button onClick={() => confirmDelete(ticket.id)} className="text-xs text-red-500 hover:underline">Delete</button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <Pagination links={tickets.links} />

            <ConfirmDeleteModal
                show={!!deleteId}
                onConfirm={handleDelete}
                onCancel={cancelDelete}
            />
        </AuthenticatedLayout>
    );
}
