import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType]       = useState('success');
    const [key, setKey]         = useState(0);
    const timerRef              = useRef(null);
    const hovered               = useRef(false);

    useEffect(() => {
        const msg  = flash?.success || flash?.error;
        const kind = flash?.success ? 'success' : 'error';
        if (msg) {
            setMessage(msg);
            setType(kind);
            setVisible(true);
            setKey((k) => k + 1);
        }
    }, [flash?.success, flash?.error]);

    useEffect(() => {
        if (!visible) return;
        const startTimer = () => {
            clearTimeout(timerRef.current);
            if (!hovered.current) {
                timerRef.current = setTimeout(() => setVisible(false), 5000);
            }
        };
        startTimer();
        return () => clearTimeout(timerRef.current);
    }, [visible, key]);

    const pause  = () => { hovered.current = true;  clearTimeout(timerRef.current); };
    const resume = () => { hovered.current = false; timerRef.current = setTimeout(() => setVisible(false), 1500); };

    if (!visible || !message) return null;

    const ok = type === 'success';

    return (
        <div
            key={key}
            role={ok ? 'status' : 'alert'}
            aria-live={ok ? 'polite' : 'assertive'}
            onMouseEnter={pause}
            onMouseLeave={resume}
            className={
                'fixed z-50 flex items-start gap-3 rounded-lg shadow-lg p-4 border text-sm ' +
                'top-16 inset-x-4 sm:inset-x-auto sm:top-20 sm:right-6 sm:w-96 ' +
                (ok
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-red-50 border-red-200 text-red-900')
            }
        >
            {ok ? (
                <svg className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ) : (
                <svg className="h-5 w-5 text-red-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
            )}
            <span className="flex-1">{message}</span>
            <button
                onClick={() => setVisible(false)}
                aria-label="Dismiss message"
                className={'shrink-0 rounded p-0.5 hover:bg-black/10 transition-colors duration-150 ' + (ok ? 'text-emerald-700' : 'text-red-700')}
            >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    );
}
