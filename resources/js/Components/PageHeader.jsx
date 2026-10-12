import { Link } from '@inertiajs/react';

/**
 * Page header with optional back link and an action slot.
 * Usage:
 *   <PageHeader title="My tickets" action={<Button>New ticket</Button>} />
 *   <PageHeader back={{ href: route('tickets.index'), label: 'Back to tickets' }} title="Create ticket" />
 */
export default function PageHeader({ title, back, action }) {
    return (
        <div className="mb-6">
            {back && (
                <Link
                    href={back.href}
                    className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-harbor transition-colors duration-150 mb-2"
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                    {back.label}
                </Link>
            )}
            <div className="flex items-center justify-between gap-4">
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-ink leading-tight">
                    {title}
                </h1>
                {action && <div className="shrink-0">{action}</div>}
            </div>
        </div>
    );
}
