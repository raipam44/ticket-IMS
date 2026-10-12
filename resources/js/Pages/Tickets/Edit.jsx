import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import TicketForm from '@/Components/TicketForm';

export default function Edit({ ticket, options }) {
    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('tickets.show', ticket.id)} className="text-sm text-gray-500 hover:text-indigo-600 transition">
                    ← Back
                </Link>
                <h2 className="text-xl font-semibold text-gray-800">Edit Ticket</h2>
            </div>
        }>
            <Head title="Edit Ticket" />

            <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <TicketForm ticket={ticket} options={options} />
            </div>
        </AuthenticatedLayout>
    );
}
