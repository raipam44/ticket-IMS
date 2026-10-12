/**
 * Format a ticket ID as a zero-padded display number, e.g. #0042
 * Display-only — the DB id is unchanged.
 */
export const ticketNo = (id) => `#${String(id).padStart(4, '0')}`;

/**
 * Format a date string as "Oct 12, 2026" for lists.
 */
export const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

/**
 * Format a date string as "Oct 12, 2026, 9:14 AM" for detail views.
 */
export const formatDateTime = (dateStr) =>
    new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
