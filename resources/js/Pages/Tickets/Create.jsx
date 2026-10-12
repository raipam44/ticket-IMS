import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import PageHeader from '@/Components/PageHeader';
import TicketForm from '@/Components/TicketForm';

export default function Create({ options }) {
    return (
        <AuthenticatedLayout>
            <Head title="Create ticket" />
            <PageHeader
                back={{ href: route('tickets.index'), label: 'Back to tickets' }}
                title="Create ticket"
            />
            <div className="max-w-2xl bg-white rounded-lg border border-line p-5 sm:p-6">
                <TicketForm options={options} />
            </div>
        </AuthenticatedLayout>
    );
}
