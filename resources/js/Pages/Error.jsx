import { Head, Link } from '@inertiajs/react';

const COPY = {
    403: {
        title: "You can't open this ticket",
        body:  "It belongs to another account. You can only view and change tickets you created.",
    },
    404: {
        title: "We can't find that page",
        body:  "The link may be old, or the ticket was deleted.",
    },
    419: {
        title: "Your session expired",
        body:  "Refresh the page and try again.",
    },
    500: {
        title: "Something went wrong on our end",
        body:  "Try again in a moment. If it keeps happening, tell your IT contact.",
    },
    503: {
        title: "Something went wrong on our end",
        body:  "Try again in a moment. If it keeps happening, tell your IT contact.",
    },
};

export default function Error({ status }) {
    const copy = COPY[status] ?? COPY[500];

    return (
        <>
            <Head title={String(status)} />
            <div className="min-h-screen bg-paper flex flex-col items-center justify-center px-4 text-center">
                <p className="font-display text-6xl font-bold text-ink mb-4">{status}</p>
                <h1 className="font-display text-2xl font-bold text-ink mb-3">{copy.title}</h1>
                <p className="text-slate-500 text-sm max-w-sm mb-8">{copy.body}</p>
                <Link
                    href={route('tickets.index')}
                    className="inline-flex items-center gap-2 rounded-md bg-harbor text-white text-sm font-medium min-h-11 px-5 hover:bg-harbor-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 transition-colors duration-150"
                >
                    Back to my tickets
                </Link>
            </div>
        </>
    );
}
