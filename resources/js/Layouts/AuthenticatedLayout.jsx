import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';

export default function AuthenticatedLayout({ children }) {
    const { auth } = usePage().props;
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Determine active nav link
    const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
    const isActive = (path) => currentPath.startsWith(path);

    const navLinkClass = (path) =>
        'text-sm transition-colors duration-150 motion-reduce:transition-none ' +
        (isActive(path)
            ? 'text-white border-b-2 border-sky-300 pb-0.5'
            : 'text-slate-200 hover:text-white');

    return (
        <div className="min-h-screen bg-paper">
            <FlashMessage />

            {/* ── Top nav bar ── */}
            <nav
                aria-label="Main"
                className="sticky top-0 z-40 bg-ink text-white h-14 flex items-center"
            >
                <div className="mx-auto max-w-6xl w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">

                    {/* Left: brand + nav links */}
                    <div className="flex items-center gap-6">
                        <Link
                            href={route('dashboard')}
                            className="font-display font-bold text-white hover:text-slate-200 transition-colors duration-150 shrink-0"
                        >
                            HelpDesk
                        </Link>
                        <div className="hidden md:flex items-center gap-5">
                            <Link
                                href={route('dashboard')}
                                aria-current={isActive('/dashboard') ? 'page' : undefined}
                                className={navLinkClass('/dashboard')}
                            >
                                Dashboard
                            </Link>
                            <Link
                                href={route('tickets.index')}
                                aria-current={isActive('/tickets') ? 'page' : undefined}
                                className={navLinkClass('/tickets')}
                            >
                                Tickets
                            </Link>
                        </div>
                    </div>

                    {/* Right: New ticket + user + logout (desktop) */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link
                            href={route('tickets.create')}
                            className="inline-flex items-center justify-center gap-1.5 rounded-md bg-white text-ink text-sm font-medium min-h-10 px-3 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 focus-visible:ring-offset-ink transition-colors duration-150"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                            New ticket
                        </Link>
                        <span className="text-sm text-slate-300 truncate max-w-[10rem]" title={auth.user?.name}>
                            {auth.user?.name}
                        </span>
                        <Link
                            method="post"
                            as="button"
                            href={route('logout')}
                            className="text-sm text-slate-300 hover:text-white transition-colors duration-150"
                        >
                            Log out
                        </Link>
                    </div>

                    {/* Phone right: [+] + hamburger */}
                    <div className="flex md:hidden items-center gap-2">
                        <Link
                            href={route('tickets.create')}
                            aria-label="New ticket"
                            className="flex items-center justify-center w-10 h-10 rounded-md bg-white/10 hover:bg-white/20 transition-colors duration-150"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                        </Link>
                        <button
                            onClick={() => setDrawerOpen(!drawerOpen)}
                            aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={drawerOpen}
                            className="flex items-center justify-center w-10 h-10 rounded-md hover:bg-white/10 transition-colors duration-150"
                        >
                            {drawerOpen ? (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Phone drawer */}
            {drawerOpen && (
                <div className="md:hidden bg-ink border-t border-white/10 shadow-xl z-30 relative">
                    <div className="mx-auto max-w-6xl px-4 py-3 space-y-1">
                        <p className="text-xs text-slate-400 pb-1 truncate">{auth.user?.name}</p>
                        <Link
                            href={route('dashboard')}
                            aria-current={isActive('/dashboard') ? 'page' : undefined}
                            onClick={() => setDrawerOpen(false)}
                            className={'block px-3 py-2 rounded-md text-sm transition-colors duration-150 ' + (isActive('/dashboard') ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white')}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route('tickets.index')}
                            aria-current={isActive('/tickets') ? 'page' : undefined}
                            onClick={() => setDrawerOpen(false)}
                            className={'block px-3 py-2 rounded-md text-sm transition-colors duration-150 ' + (isActive('/tickets') ? 'bg-white/10 text-white' : 'text-slate-200 hover:bg-white/10 hover:text-white')}
                        >
                            Tickets
                        </Link>
                        <div className="border-t border-white/10 pt-2 mt-2">
                            <Link
                                method="post"
                                as="button"
                                href={route('logout')}
                                className="block px-3 py-2 text-sm text-slate-300 hover:text-white transition-colors duration-150"
                            >
                                Log out
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Page content */}
            <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {children}
            </main>
        </div>
    );
}
