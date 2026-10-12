import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import TicketForm from '@/Components/TicketForm';

export default function Edit({ ticket, options }) {
    return (
        <AuthenticatedLayout>
            <Head title="Edit ticket" />
            <PageHeader
                back={{ href: route('tickets.show', ticket.id), label: 'Back to ticket' }}
                title="Edit ticket"
            />
            <div className="max-w-2xl bg-white rounded-lg border border-line p-5 sm:p-6">
                <TicketForm ticket={ticket} options={options} />
            </div>
        </AuthenticatedLayout>
    );
}
