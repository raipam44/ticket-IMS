import { useEffect, useRef, useState } from 'react';

export default function ConfirmDeleteModal({ show, ticket, onConfirm, onCancel }) {
    const keepRef    = useRef(null);
    const deleteRef  = useRef(null);
    const [busy, setBusy] = useState(false);

    // Auto-focus the safe button when modal opens
    useEffect(() => {
        if (show) {
            setBusy(false);
            // Defer so the element is visible
            setTimeout(() => keepRef.current?.focus(), 10);
        }
    }, [show]);

    // Focus trap — keep Tab/Shift+Tab within the two buttons
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') { onCancel(); return; }
        if (e.key !== 'Tab') return;
        const els = [keepRef.current, deleteRef.current].filter(Boolean);
        if (!els.length) return;
        const first = els[0], last = els[els.length - 1];
        if (e.shiftKey) {
            if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
            if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
    };

    const handleConfirm = () => {
        setBusy(true);
        onConfirm();
    };

    if (!show) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onKeyDown={handleKeyDown}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-ink/50"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Panel */}
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 space-y-4"
            >
                <h2 id="modal-title" className="font-display text-lg font-semibold text-ink">
                    Delete this ticket?
                </h2>

                <p className="text-sm text-slate-600">
                    {ticket?.title ? (
                        <><span className="font-medium text-ink">"{ticket.title}"</span> will be permanently removed. </>
                    ) : (
                        'This ticket will be permanently removed. '
                    )}
                    This can't be undone.
                </p>

                <div className="flex justify-end gap-3 pt-2">
                    <button
                        ref={keepRef}
                        onClick={onCancel}
                        className="inline-flex items-center justify-center gap-2 rounded-md border border-line bg-white text-ink text-sm font-medium min-h-11 sm:min-h-10 px-4 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 transition-colors duration-150"
                    >
                        Keep ticket
                    </button>
                    <button
                        ref={deleteRef}
                        onClick={handleConfirm}
                        disabled={busy}
                        className="inline-flex items-center justify-center gap-2 rounded-md bg-red-600 text-white text-sm font-medium min-h-11 sm:min-h-10 px-4 hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
                    >
                        {busy ? 'Deleting…' : 'Delete ticket'}
                    </button>
                </div>
            </div>
        </div>
    );
}
