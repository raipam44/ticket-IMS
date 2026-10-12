import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import TicketTable from '@/Components/TicketTable';
import TicketStubCard from '@/Components/TicketStubCard';
import EmptyState from '@/Components/EmptyState';
import Pagination from '@/Components/Pagination';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function Index({ tickets, filters, options }) {
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [localFilters, setLocalFilters] = useState({
        status:   filters.status   ?? '',
        priority: filters.priority ?? '',
        category: filters.category ?? '',
        search:   filters.search   ?? '',
    });

    const isFiltered = Object.values(localFilters).some(Boolean);

    const applyFilter = (updates) => {
        const merged = { ...localFilters, ...updates };
        setLocalFilters(merged);
        const params = Object.fromEntries(
            Object.entries(merged).filter(([, v]) => v !== '')
        );
        router.get(route('tickets.index'), params, { preserveState: true, replace: true });
    };

    const clearFilters = () => applyFilter({ status: '', priority: '', category: '', search: '' });

    const handleDelete = () => {
        if (!deleteTarget) return;
        router.delete(route('tickets.destroy', deleteTarget.id), {
            onFinish: () => setDeleteTarget(null),
        });
    };

    const data = tickets.data ?? [];

    return (
        <AuthenticatedLayout>
            <Head title="My tickets" />

            {/* Page header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink">My tickets</h1>
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

            {/* Filters */}
            <div className="bg-white rounded-lg border border-line p-4 mb-5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <input
                        type="search"
                        placeholder="Search title…"
                        value={localFilters.search}
                        onChange={(e) => applyFilter({ search: e.target.value })}
                        className="rounded-md border border-line bg-white text-sm min-h-10 px-3 py-2 focus:border-harbor focus:ring-2 focus:ring-harbor/30 focus:outline-none placeholder:text-slate-500"
                    />
                    <select
                        value={localFilters.status}
                        onChange={(e) => applyFilter({ status: e.target.value })}
                        className="rounded-md border border-line bg-white text-sm min-h-10 px-3 py-2 focus:border-harbor focus:ring-2 focus:ring-harbor/30 focus:outline-none"
                        aria-label="Filter by status"
                    >
                        <option value="">All statuses</option>
                        {options.statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select
                        value={localFilters.priority}
                        onChange={(e) => applyFilter({ priority: e.target.value })}
                        className="rounded-md border border-line bg-white text-sm min-h-10 px-3 py-2 focus:border-harbor focus:ring-2 focus:ring-harbor/30 focus:outline-none"
                        aria-label="Filter by priority"
                    >
                        <option value="">All priorities</option>
                        {options.priorities.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select
                        value={localFilters.category}
                        onChange={(e) => applyFilter({ category: e.target.value })}
                        className="rounded-md border border-line bg-white text-sm min-h-10 px-3 py-2 focus:border-harbor focus:ring-2 focus:ring-harbor/30 focus:outline-none"
                        aria-label="Filter by category"
                    >
                        <option value="">All categories</option>
                        {options.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                {isFiltered && (
                    <div className="mt-3">
                        <button
                            onClick={clearFilters}
                            className="text-xs text-harbor hover:underline underline-offset-2"
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {/* Empty state */}
            {data.length === 0 ? (
                <EmptyState filtered={isFiltered} onClearFilters={clearFilters} />
            ) : (
                <>
                    {/* Desktop table */}
                    <TicketTable tickets={data} onDelete={setDeleteTarget} />

                    {/* Phone cards */}
                    <div className="md:hidden space-y-3">
                        {data.map((ticket) => (
                            <TicketStubCard key={ticket.id} ticket={ticket} onDelete={setDeleteTarget} />
                        ))}
                    </div>
                </>
            )}

            <Pagination links={tickets.links} meta={tickets.meta} />

            <ConfirmDeleteModal
                show={!!deleteTarget}
                ticket={deleteTarget}
                onConfirm={handleDelete}
                onCancel={() => setDeleteTarget(null)}
            />
        </AuthenticatedLayout>
    );
}
