import { useForm } from '@inertiajs/react';

export default function TicketForm({ ticket = null, options }) {
    const { data, setData, post, put, processing, errors } = useForm({
        title:       ticket?.title       ?? '',
        description: ticket?.description ?? '',
        priority:    ticket?.priority    ?? 'Medium',
        status:      ticket?.status      ?? 'Open',
        category:    ticket?.category    ?? '',
    });

    const submit = (e) => {
        e.preventDefault();
        if (ticket) {
            put(route('tickets.update', ticket.id));
        } else {
            post(route('tickets.store'));
        }
    };

    return (
        <form onSubmit={submit} className="space-y-6">
            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="title">
                    Title <span className="text-red-500">*</span>
                </label>
                <input
                    id="title"
                    type="text"
                    value={data.title}
                    onChange={(e) => setData('title', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.title ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Brief summary of the issue (5–255 characters)"
                />
                {errors.title && <p className="mt-1 text-xs text-red-600">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                    Description <span className="text-red-500">*</span>
                </label>
                <textarea
                    id="description"
                    rows={5}
                    value={data.description}
                    onChange={(e) => setData('description', e.target.value)}
                    className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        errors.description ? 'border-red-400' : 'border-gray-300'
                    }`}
                    placeholder="Describe the issue in detail (at least 10 characters)"
                />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
            </div>

            {/* Priority, Status, Category */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="priority">
                        Priority <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="priority"
                        value={data.priority}
                        onChange={(e) => setData('priority', e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.priority ? 'border-red-400' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select priority</option>
                        {options.priorities.map((p) => (
                            <option key={p} value={p}>{p}</option>
                        ))}
                    </select>
                    {errors.priority && <p className="mt-1 text-xs text-red-600">{errors.priority}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="status">
                        Status <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="status"
                        value={data.status}
                        onChange={(e) => setData('status', e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.status ? 'border-red-400' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select status</option>
                        {options.statuses.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                    {errors.status && <p className="mt-1 text-xs text-red-600">{errors.status}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                        Category <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="category"
                        value={data.category}
                        onChange={(e) => setData('category', e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            errors.category ? 'border-red-400' : 'border-gray-300'
                        }`}
                    >
                        <option value="">Select category</option>
                        {options.categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                    {errors.category && <p className="mt-1 text-xs text-red-600">{errors.category}</p>}
                </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
                >
                    {processing ? (
                        <>
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                            </svg>
                            Saving…
                        </>
                    ) : (
                        ticket ? 'Update Ticket' : 'Create Ticket'
                    )}
                </button>
            </div>
        </form>
    );
}
