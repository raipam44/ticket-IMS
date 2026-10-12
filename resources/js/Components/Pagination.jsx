import { Link } from '@inertiajs/react';

export default function Pagination({ links }) {
    if (!links || links.length <= 3) return null;

    return (
        <div className="flex flex-wrap items-center justify-center gap-1 mt-6">
            {links.map((link, i) => {
                if (!link.url) {
                    return (
                        <span
                            key={i}
                            className="px-3 py-1.5 text-sm text-gray-400 rounded"
                            dangerouslySetInnerHTML={undefined}
                        >
                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </span>
                    );
                }
                return (
                    <Link
                        key={i}
                        href={link.url}
                        className={`px-3 py-1.5 text-sm rounded border transition ${
                            link.active
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                        }`}
                        preserveScroll
                    >
                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                    </Link>
                );
            })}
        </div>
    );
}
