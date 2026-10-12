import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import TicketForm from '@/Components/TicketForm';

export default function Create({ options }) {
    return (
        <AuthenticatedLayout header={
            <div className="flex items-center gap-3">
                <Link href={route('tickets.index')} className="text-sm text-gray-500 hover:text-indigo-600 transition">
                    ← Back
                </Link>
                <h2 className="text-xl font-semibold text-gray-800">New Ticket</h2>
            </div>
        }>
            <Head title="New Ticket" />

            <div className="max-w-2xl bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <TicketForm options={options} />
            </div>
        </AuthenticatedLayout>
    );
}
