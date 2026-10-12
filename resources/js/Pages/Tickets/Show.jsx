import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import PriorityBadge from '@/Components/PriorityBadge';
import StatusBadge from '@/Components/StatusBadge';
import ConfirmDeleteModal from '@/Components/ConfirmDeleteModal';

export default function Show({ ticket }) {
    const [showDelete, setShowDelete] = useState(false);

    const handleDelete = () => {
        router.delete(route('tickets.destroy', ticket.id));
    };

    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('tickets.index')} className="text-sm text-gray-500 hover:text-indigo-600 transition">
                    ← Back
                </Link>
                <h2 className="text-xl font-semibold text-gray-800">Ticket #{ticket.id}</h2>
            </div>
        }>
            <Head title={`Ticket #${ticket.id}`} />

            <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{ticket.title}</h1>
                    <p className="text-xs text-gray-400 mt-1">
                        Filed {new Date(ticket.created_at).toLocaleString()}
                        {ticket.updated_at !== ticket.created_at && (
                            <> · Updated {new Date(ticket.updated_at).toLocaleString()}</>
                        )}
                    </p>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span className="font-medium">Priority:</span>
                        <PriorityBadge priority={ticket.priority} />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span className="font-medium">Status:</span>
                        <StatusBadge status={ticket.status} />
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span className="font-medium">Category:</span>
                        <span className="bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                            {ticket.category}
                        </span>
                    </div>
                </div>

                {/* Description */}
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                    <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-100">
                        {ticket.description}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                    <Link
                        href={route('tickets.edit', ticket.id)}
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                    >
                        Edit
                    </Link>
                    <button
                        onClick={() => setShowDelete(true)}
                        className="inline-flex items-center px-4 py-2 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition border border-red-200"
                    >
                        Delete
                    </button>
                </div>
            </div>

            <ConfirmDeleteModal
                show={showDelete}
                onConfirm={handleDelete}
                onCancel={() => setShowDelete(false)}
            />
        </AuthenticatedLayout>
    );
}
