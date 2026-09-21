'use client';

import React, { useState } from 'react';
import { RequireAuth } from '@/components/utils';
import { Table, TBody, TD, TH, THead, TR } from '@/components/ui/Table';
import { formatDate } from '@/components/orders/ordersUtils';
import {
    useDownloadSmsContactsCsvMutation,
    useGetSmsContactsQuery,
} from '@/redux/features/addresses/addressApiSlice';

// The CSV is the deliverable; the table is a preview. Rendering every row of a
// list that only grows would make the page crawl for no benefit.
const PREVIEW_ROWS = 500;

function StatTile({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
            <p className="text-3xl font-bold text-primary-text dark:text-primary-text-light">
                {value}
            </p>
            <p className="mt-1 text-sm text-primary-text/60 dark:text-primary-text-light/60">
                {label}
            </p>
        </div>
    );
}

function SmsContactsInner() {
    const { data, isLoading, error } = useGetSmsContactsQuery();
    const [downloadCsv, { isLoading: downloading }] = useDownloadSmsContactsCsvMutation();
    const [downloadError, setDownloadError] = useState<string | null>(null);

    // RequireAuth only checks that someone is signed in, not that they are an
    // admin, so any logged-in customer can reach this URL and needs to be told
    // why there is nothing here.
    const status = error && 'status' in error ? (error as { status: unknown }).status : null;
    const isForbidden = status === 403 || status === 401;

    const handleDownload = async () => {
        setDownloadError(null);
        try {
            const csv = await downloadCsv().unwrap();
            const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sms_contacts.csv';
            // Appended before clicking, as useOrderActions does - Firefox
            // ignores a click on an anchor that is not in the document.
            document.body.append(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(url);
        } catch {
            setDownloadError('Could not download the CSV — please try again.');
        }
    };

    if (isForbidden) {
        return (
            <div className="container mx-auto py-8">
                <h1 className="mb-4 text-2xl font-bold text-primary-text dark:text-primary-text-light">
                    SMS Contacts
                </h1>
                <p className="text-red-600 dark:text-red-400">
                    You need to be signed in as an admin to see these.
                </p>
            </div>
        );
    }

    const contacts = data?.contacts ?? [];
    const shown = contacts.slice(0, PREVIEW_ROWS);

    return (
        <div className="container mx-auto max-w-3xl py-8">
            <h1 className="mb-2 text-2xl font-bold text-primary-text dark:text-primary-text-light">
                SMS Contacts
            </h1>
            <p className="mb-6 text-sm text-primary-text/70 dark:text-primary-text-light/70">
                Every UK mobile number we hold, one per person rather than one per order.
                Landlines and international numbers are left out. Download the CSV to load
                the list into a Mailchimp SMS audience.
            </p>

            {isLoading && (
                <p className="text-primary-text dark:text-primary-text-light">Loading…</p>
            )}

            {error && !isForbidden && (
                <p className="text-red-600 dark:text-red-400">Could not load the contacts.</p>
            )}

            {data && (
                <>
                    <div className="mb-6 grid grid-cols-2 gap-4">
                        <StatTile label="Mobile numbers" value={data.total} />
                        <StatTile label="New in the last 30 days" value={data.new_last_30_days} />
                    </div>

                    <div className="mb-2 flex flex-wrap items-center gap-3">
                        <button
                            type="button"
                            onClick={handleDownload}
                            disabled={downloading || data.total === 0}
                            className="rounded-md bg-primary px-4 py-2 font-semibold text-primary-button-text disabled:opacity-50"
                        >
                            {downloading ? 'Preparing…' : 'Download CSV'}
                        </button>
                        <span className="text-xs text-primary-text/60 dark:text-primary-text-light/60">
                            Phone, First Name, Last Name — numbers in +44 form.
                        </span>
                    </div>

                    {downloadError && (
                        <p className="mb-2 text-sm text-red-600 dark:text-red-400">{downloadError}</p>
                    )}

                    <div className="mt-4">
                        <Table>
                            <THead>
                                <TR>
                                    <TH>Phone</TH>
                                    <TH>Name</TH>
                                    <TH>First seen</TH>
                                </TR>
                            </THead>
                            <TBody>
                                {shown.map(contact => (
                                    <TR key={contact.phone}>
                                        <TD className="whitespace-nowrap font-mono text-xs">
                                            {contact.phone}
                                        </TD>
                                        <TD>
                                            {[contact.first_name, contact.last_name]
                                                .filter(Boolean)
                                                .join(' ') || '—'}
                                        </TD>
                                        <TD className="whitespace-nowrap">
                                            {formatDate(contact.first_seen).date}
                                        </TD>
                                    </TR>
                                ))}
                            </TBody>
                        </Table>

                        {contacts.length === 0 && (
                            <p className="mt-4 text-sm text-primary-text/60 dark:text-primary-text-light/60">
                                No mobile numbers yet.
                            </p>
                        )}

                        {contacts.length > shown.length && (
                            <p className="mt-2 text-xs text-primary-text/60 dark:text-primary-text-light/60">
                                Showing the first {shown.length} of {contacts.length} — the CSV has
                                them all.
                            </p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default function AdminSmsContactsPage() {
    return (
        <RequireAuth>
            <SmsContactsInner />
        </RequireAuth>
    );
}
