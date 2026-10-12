import { useForm } from '@inertiajs/react';
import { useRef } from 'react';
import { Link } from '@inertiajs/react';

export default function TicketForm({ ticket = null, options }) {
    const firstErrorRef = useRef(null);

    const { data, setData, post, put, processing, errors } = useForm({
        title:       ticket?.title       ?? '',
        description: ticket?.description ?? '',
        priority:    ticket?.priority    ?? 'Medium',
        status:      ticket?.status      ?? 'Open',
        category:    ticket?.category    ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        const method = ticket ? put : post;
        const url    = ticket ? route('tickets.update', ticket.id) : route('tickets.store');
        method(url, {
            onError: () => firstErrorRef.current?.focus(),
        });
    };

    const fieldClass = (field) =>
        `mt-1.5 block w-full rounded-md bg-white text-base sm:text-sm min-h-11 sm:min-h-10 px-3 py-2 ` +
        `border ${errors[field] ? 'border-red-600' : 'border-line'} ` +
        `focus:border-harbor focus:ring-2 focus:ring-harbor/30 focus:outline-none ` +
        `placeholder:text-slate-500 transition-colors duration-150`;

    return (
        <form onSubmit={submit} noValidate className="space-y-5">
            {/* Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-ink">
                    Title
                </label>
                <input
                    ref={errors.title ? firstErrorRef : undefined}
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    aria-invalid={!!errors.title}
                    aria-describedby={errors.title ? 'title-error' : 'title-hint'}
                    className={fieldClass('title')}
                    placeholder="e.g. Printer jams on floor 2"
                    maxLength={255}
                />
                <p id="title-hint" className="mt-1 text-xs text-slate-600">
                    Short and specific, at least 5 characters. ({data.title.length}/255)
                </p>
                {errors.title && (
                    <p id="title-error" className="mt-1 text-sm text-red-700" role="alert">
                        {errors.title}
                    </p>
                )}
            </div>

            {/* Description */}
            <div>
                <label htmlFor="description" className="block text-sm font-medium text-ink">
                    Description
                </label>
                <textarea
                    ref={errors.description && !errors.title ? firstErrorRef : undefined}
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    aria-invalid={!!errors.description}
                    aria-describedby={errors.description ? 'description-error' : 'description-hint'}
                    className={fieldClass('description') + ' resize-y'}
                    placeholder="What happened and what were you doing when it occurred?"
                />
                <p id="description-hint" className="mt-1 text-xs text-slate-600">
                    What happened and what you were doing. At least 10 characters.
                </p>
                {errors.description && (
                    <p id="description-error" className="mt-1 text-sm text-red-700" role="alert">
                        {errors.description}
                    </p>
                )}
            </div>

            {/* Category, Priority, Status — 3 columns on sm+ */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {/* Category */}
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-ink">
                        Category
                    </label>
                    <select
                        id="category"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        aria-invalid={!!errors.category}
                        aria-describedby={errors.category ? 'category-error' : 'category-hint'}
                        className={fieldClass('category')}
                    >
                        <option value="">Pick the closest match</option>
                        {options.categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    <p id="category-hint" className="mt-1 text-xs text-slate-600">Pick the closest match.</p>
                    {errors.category && (
                        <p id="category-error" className="mt-1 text-sm text-red-700" role="alert">
                            {errors.category}
                        </p>
                    )}
                </div>

                {/* Priority */}
                <div>
                    <label htmlFor="priority" className="block text-sm font-medium text-ink">
                        Priority
                    </label>
                    <select
                        id="priority"
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                        aria-invalid={!!errors.priority}
                        aria-describedby={errors.priority ? 'priority-error' : 'priority-hint'}
                        className={fieldClass('priority')}
                    >
                        <option value="">How much it's blocking you</option>
                        {options.priorities.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    <p id="priority-hint" className="mt-1 text-xs text-slate-600">How much it is blocking your work.</p>
                    {errors.priority && (
                        <p id="priority-error" className="mt-1 text-sm text-red-700" role="alert">
                            {errors.priority}
                        </p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <label htmlFor="status" className="block text-sm font-medium text-ink">
                        Status
                    </label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        aria-invalid={!!errors.status}
                        aria-describedby={errors.status ? 'status-error' : 'status-hint'}
                        className={fieldClass('status')}
                    >
                        {options.statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    <p id="status-hint" className="mt-1 text-xs text-slate-600">Where the work stands now.</p>
                    {errors.status && (
                        <p id="status-error" className="mt-1 text-sm text-red-700" role="alert">
                            {errors.status}
                        </p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-harbor px-4 min-h-11 sm:min-h-10 text-sm font-medium text-white hover:bg-harbor-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150 motion-reduce:transition-none"
                >
                    {processing ? (
                        <>
                            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Saving…
                        </>
                    ) : (
                        ticket ? 'Update ticket' : 'Create ticket'
                    )}
                </button>
                <Link
                    href={ticket ? route('tickets.show', ticket.id) : route('tickets.index')}
                    className="text-sm text-slate-500 hover:text-ink transition-colors duration-150"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}
