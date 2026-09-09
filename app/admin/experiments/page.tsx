'use client';

import { RequireAuth } from '@/components/utils';
import ExperimentResults from '@/components/admin/ExperimentResults';

export default function ExperimentsPage() {
    return (
        <RequireAuth>
            <div className="container mx-auto py-8">
                <h1 className="text-2xl font-bold mb-6 text-primary-text dark:text-primary-text-light">
                    Experiments
                </h1>
                <ExperimentResults />
            </div>
        </RequireAuth>
    );
}
