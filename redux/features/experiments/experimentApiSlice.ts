import { apiSlice } from '@/redux/services/apiSlice';
import type { ExperimentResults, VariantResponse } from '@/types/experiments';

const experimentApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        assignVariant: builder.mutation<VariantResponse, { experiment: string }>({
            query: body => ({
                url: '/experiments/assign/',
                method: 'POST',
                body,
            }),
        }),
        recordExperimentEvent: builder.mutation<void, { experiment: string; name: string }>({
            query: body => ({
                url: '/experiments/event/',
                method: 'POST',
                body,
            }),
        }),
        getExperimentResults: builder.query<ExperimentResults, string>({
            query: key => `/experiments/${key}/results/`,
        }),
    }),
});

export const {
    useAssignVariantMutation,
    useRecordExperimentEventMutation,
    useGetExperimentResultsQuery,
} = experimentApiSlice;

export default experimentApiSlice;
