/**
 * Button variants per DESIGN.md §7.1
 * Usage: <Button variant="primary" disabled={processing}>Save</Button>
 */
const BASE =
    'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium ' +
    'min-h-11 sm:min-h-10 px-4 py-2 ' +
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 ' +
    'disabled:opacity-60 disabled:cursor-not-allowed ' +
    'transition-colors duration-150 motion-reduce:transition-none';

const VARIANTS = {
    primary:   'bg-harbor text-white hover:bg-harbor-dark',
    'on-dark': 'bg-white text-ink hover:bg-slate-100',
    secondary: 'border border-line bg-white text-ink hover:bg-slate-50',
    danger:    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600',
    link:      'min-h-0 px-0 py-0 text-harbor underline-offset-2 hover:underline focus-visible:ring-offset-0',
};

export default function Button({
    variant = 'primary',
    className = '',
    children,
    ...props
}) {
    return (
        <button
            className={`${BASE} ${VARIANTS[variant] ?? VARIANTS.primary} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}
