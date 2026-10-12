import { Link } from '@inertiajs/react';

function label(raw) {
    // Strip HTML entities; return plain Previous / Next text
    return raw.replace('&laquo;', '').replace('&raquo;', '').trim();
}

export default function Pagination({ links, meta }) {
    if (!links || links.length <= 3) return null;

    const prev    = links[0];
    const next    = links[links.length - 1];
    const pages   = links.slice(1, -1);
    const current = pages.find((l) => l.active);
    const total   = pages.length;
    const currentNum = current ? pages.indexOf(current) + 1 : 1;

    return (
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Result count — shown on sm+ */}
            {meta && (
                <p className="hidden sm:block text-sm text-slate-500">
                    Showing {meta.from ?? 0} to {meta.to ?? 0} of {meta.total ?? 0}
                </p>
            )}

            {/* Phone: just Previous / Page n of N / Next */}
            <div className="flex sm:hidden items-center gap-2 w-full justify-between">
                {prev.url ? (
                    <Link href={prev.url} preserveScroll
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-line bg-white text-sm text-ink hover:bg-slate-50 transition-colors duration-150 min-h-11">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Previous
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm text-slate-400 opacity-50">Previous</span>
                )}
                <span className="text-sm text-slate-600">Page {currentNum} of {total}</span>
                {next.url ? (
                    <Link href={next.url} preserveScroll
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-line bg-white text-sm text-ink hover:bg-slate-50 transition-colors duration-150 min-h-11">
                        Next
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </Link>
                ) : (
                    <span className="px-3 py-2 text-sm text-slate-400 opacity-50">Next</span>
                )}
            </div>

            {/* Desktop: full page list */}
            <div className="hidden sm:flex items-center gap-1">
                {/* Previous */}
                {prev.url ? (
                    <Link href={prev.url} preserveScroll aria-label="Previous page"
                        className="px-3 py-1.5 rounded-md border border-line bg-white text-sm text-ink hover:bg-slate-50 transition-colors duration-150">
                        {label(prev.label) || 'Previous'}
                    </Link>
                ) : (
                    <span className="px-3 py-1.5 text-sm text-slate-400 opacity-50 pointer-events-none">Previous</span>
                )}

                {/* Page numbers */}
                {pages.map((page, i) => (
                    page.url ? (
                        <Link key={i} href={page.url} preserveScroll aria-current={page.active ? 'page' : undefined}
                            className={'px-3 py-1.5 rounded-md text-sm border transition-colors duration-150 ' + (
                                page.active
                                    ? 'bg-harbor text-white border-harbor'
                                    : 'bg-white text-ink border-line hover:bg-slate-50'
                            )}>
                            {page.label}
                        </Link>
                    ) : (
                        <span key={i} className="px-2 py-1.5 text-sm text-slate-400">…</span>
                    )
                ))}

                {/* Next */}
                {next.url ? (
                    <Link href={next.url} preserveScroll aria-label="Next page"
                        className="px-3 py-1.5 rounded-md border border-line bg-white text-sm text-ink hover:bg-slate-50 transition-colors duration-150">
                        {label(next.label) || 'Next'}
                    </Link>
                ) : (
                    <span className="px-3 py-1.5 text-sm text-slate-400 opacity-50 pointer-events-none">Next</span>
                )}
            </div>
        </div>
    );
}
