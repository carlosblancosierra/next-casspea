'use client';

import { Fragment, ReactNode } from 'react';
import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DrawerProps {
    open: boolean;
    onClose: () => void;
    title?: ReactNode;
    children: ReactNode;
}

/**
 * Right-hand slide-over from `md` up, bottom sheet below it.
 *
 * Built on headlessui's Dialog so it gets a focus trap, Escape handling,
 * scroll locking and a portal — none of which the hand-rolled `fixed inset-0`
 * overlays elsewhere in the app have.
 */
export default function Drawer({ open, onClose, title, children }: DrawerProps) {
    return (
        <Transition show={open} as={Fragment}>
            <Dialog onClose={onClose} className="relative z-50">
                <TransitionChild
                    as={Fragment}
                    enter="ease-out duration-200"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-150"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                </TransitionChild>

                <div className="fixed inset-0 flex items-end justify-center md:items-stretch md:justify-end">
                    <TransitionChild
                        as={Fragment}
                        enter="transform transition ease-out duration-200"
                        enterFrom="translate-y-full md:translate-y-0 md:translate-x-full"
                        enterTo="translate-y-0 md:translate-x-0"
                        leave="transform transition ease-in duration-150"
                        leaveFrom="translate-y-0 md:translate-x-0"
                        leaveTo="translate-y-full md:translate-y-0 md:translate-x-full"
                    >
                        <DialogPanel className="flex w-full max-h-[90vh] flex-col rounded-t-2xl bg-main-bg shadow-xl dark:bg-main-bg-dark md:h-full md:max-h-none md:max-w-xl md:rounded-none">
                            <div className="flex items-start justify-between gap-4 border-b border-black/10 px-5 py-4 dark:border-white/10">
                                <DialogTitle className="text-base font-semibold text-primary-text dark:text-primary-text-light">
                                    {title}
                                </DialogTitle>
                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close"
                                    className="-m-1 rounded p-1 text-primary-text/60 hover:text-primary-text focus:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:text-primary-text-light/60 dark:hover:text-primary-text-light"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="overflow-y-auto px-5 py-4">{children}</div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}
