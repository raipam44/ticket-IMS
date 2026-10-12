import { usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function FlashMessage() {
    const { flash } = usePage().props;
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(null);
    const [type, setType] = useState('success');

    useEffect(() => {
        if (flash.success) {
            setMessage(flash.success);
            setType('success');
            setVisible(true);
        } else if (flash.error) {
            setMessage(flash.error);
            setType('error');
            setVisible(true);
        } else {
            setVisible(false);
        }

        const timer = setTimeout(() => setVisible(false), 4000);
        return () => clearTimeout(timer);
    }, [flash.success, flash.error]);

    if (!visible || !message) return null;

    return (
        <div
            className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
                type === 'success'
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-red-100 text-red-800 border border-red-300'
            }`}
        >
            <span>{message}</span>
            <button
                onClick={() => setVisible(false)}
                className="ml-2 text-lg leading-none opacity-60 hover:opacity-100"
                aria-label="Close"
            >
                ×
            </button>
        </div>
    );
}
