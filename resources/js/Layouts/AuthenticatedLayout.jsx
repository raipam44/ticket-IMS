import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import FlashMessage from '@/Components/FlashMessage';

export default function AuthenticatedLayout({ header, children }) {
    const { auth } = usePage().props;
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <FlashMessage />

            {/* Nav */}
            <nav className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Left: Brand + Links */}
                        <div className="flex items-center gap-6">
                            <Link
                                href={route('dashboard')}
                                className="text-lg font-bold text-indigo-600 hover:text-indigo-700"
                            >
                                HelpDesk
                            </Link>
                            <div className="hidden sm:flex items-center gap-4">
                                <Link
                                    href={route('dashboard')}
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href={route('tickets.index')}
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition"
                                >
                                    Tickets
                                </Link>
                            </div>
                        </div>

                        {/* Right: New Ticket + User + Logout */}
                        <div className="hidden sm:flex items-center gap-3">
                            <Link
                                href={route('tickets.create')}
                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition"
                            >
                                + New Ticket
                            </Link>
                            <span className="text-sm text-gray-600">{auth.user?.name}</span>
                            <Link
                                method="post"
                                as="button"
                                href={route('logout')}
                                className="text-sm text-gray-500 hover:text-red-600 transition"
                            >
                                Logout
                            </Link>
                        </div>

                        {/* Mobile hamburger */}
                        <button
                            className="sm:hidden p-2 rounded-md text-gray-500 hover:text-gray-700"
                            onClick={() => setMenuOpen(!menuOpen)}
                            aria-label="Toggle menu"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {menuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {menuOpen && (
                    <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2">
                        <Link
                            href={route('dashboard')}
                            className="block text-sm font-medium text-gray-700 hover:text-indigo-600 py-1"
                            onClick={() => setMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route('tickets.index')}
                            className="block text-sm font-medium text-gray-700 hover:text-indigo-600 py-1"
                            onClick={() => setMenuOpen(false)}
                        >
                            Tickets
                        </Link>
                        <Link
                            href={route('tickets.create')}
                            className="block text-sm font-medium text-indigo-600 py-1"
                            onClick={() => setMenuOpen(false)}
                        >
                            + New Ticket
                        </Link>
                        <div className="border-t border-gray-100 pt-2">
                            <span className="block text-xs text-gray-400 mb-1">{auth.user?.name}</span>
                            <Link
                                method="post"
                                as="button"
                                href={route('logout')}
                                className="text-sm text-red-500 hover:text-red-700"
                            >
                                Logout
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Page Header */}
            {header && (
                <header className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Content */}
            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {children}
            </main>
        </div>
    );
}
