'use client';

import { RequireAuth } from '@/components/utils';
import { useGetAddressesStatsQuery } from '@/redux/features/addresses/addressApiSlice';
import React from 'react';

export default function AddressesStatsPage() {
    const { data, isLoading, isError } = useGetAddressesStatsQuery();

    // Helper to download CSV
    const handleDownloadCSV = () => {
        if (!data) return;
        const sorted = [...data].sort((a, b) => b.count - a.count);
        const csvRows = [
            ['Postcode', 'Count'],
            ...sorted.map(row => [row.postcode, row.count])
        ];
        const csvContent = csvRows.map(e => e.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'address_stats.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <RequireAuth>
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6">Addresses Stats</h1>
                {isLoading && <p>Loading...</p>}
                {isError && <p>Error loading stats.</p>}
                {data && (
                    <>
                        <button
                            onClick={handleDownloadCSV}
                            className="mb-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark"
                        >
                            Download CSV
                        </button>
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">Postcode</th>
                                    <th className="px-4 py-2 border-b">Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[...data]
                                    .sort((a, b) => b.count - a.count)
                                    .map((row, idx) => (
                                        <tr key={row.postcode + idx}>
                                            <td className="px-4 py-2 border-b">{row.postcode}</td>
                                            <td className="px-4 py-2 border-b">{row.count}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    </>
                )}
            </div>
        </RequireAuth>
    );
}
