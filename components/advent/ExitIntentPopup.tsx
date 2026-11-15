'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/20/solid';
import EmailCapture from './EmailCapture';
import { COPY } from './content';
import { hasSubscribed } from './subscribed';

const SEEN_KEY = 'casspea_advent_exit_intent_seen';
/** Not in the first seconds: leaving that fast is not hesitating. */
const ARM_AFTER_MS = 5000;

function alreadySeen(): boolean {
    try {
        return window.sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
        return false;
    }
}

function markSeen(): void {
    try {
        window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
        // Storage blocked: it may show again next page view; acceptable.
    }
}

/**
 * Asks for an email when the pointer leaves the top of the window, the
 * moment someone heads for the tab bar or the back button. Desktop only (a
 * fine pointer and a wide screen: phones have no such moment), once per
 * session, and never for someone who has already signed up.
 */
export default function ExitIntentPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!window.matchMedia?.('(pointer: fine) and (min-width: 1024px)').matches) return;
        if (alreadySeen() || hasSubscribed()) return;

        let armed = false;
        const timer = setTimeout(() => (armed = true), ARM_AFTER_MS);
        const onLeave = (event: MouseEvent) => {
            if (!armed || event.relatedTarget || event.clientY > 0) return;
            markSeen();
            setOpen(true);
            document.removeEventListener('mouseout', onLeave);
        };
        document.addEventListener('mouseout', onLeave);
        return () => {
            clearTimeout(timer);
            document.removeEventListener('mouseout', onLeave);
        };
    }, []);

    return (
        <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <DialogPanel className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl dark:bg-gray-900">
                    <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        aria-label="Close"
                    >
                        <XMarkIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                    <DialogTitle className="font-playfair text-2xl font-bold text-primary-text dark:text-primary-text-light">
                        {COPY.exitIntent.heading}
                    </DialogTitle>
                    <p className="mb-4 mt-2 text-gray-700 dark:text-gray-300">{COPY.exitIntent.body}</p>
                    <EmailCapture
                        source="exit-intent"
                        buttonLabel={COPY.exitIntent.button}
                        doneMessage={COPY.exitIntent.done}
                        autoFocus
                    />
                </DialogPanel>
            </div>
        </Dialog>
    );
}
