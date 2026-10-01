import { renderHook, waitFor } from '@testing-library/react';
import { useExperiment } from '@/hooks/useExperiment';
import {
    useAssignVariantMutation,
    useRecordExperimentEventMutation,
} from '@/redux/features/experiments/experimentApiSlice';

jest.mock('@/redux/features/experiments/experimentApiSlice', () => ({
    useAssignVariantMutation: jest.fn(),
    useRecordExperimentEventMutation: jest.fn(),
}));

const mockAssign = useAssignVariantMutation as jest.Mock;
const mockRecord = useRecordExperimentEventMutation as jest.Mock;

const setAssignResult = (result: Promise<unknown>) => {
    mockAssign.mockReturnValue([jest.fn(() => ({ unwrap: () => result })), {}]);
};

describe('useExperiment', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockRecord.mockReturnValue([
            jest.fn(() => ({ unwrap: () => Promise.resolve() })),
            {},
        ]);
    });

    it('reports the variant the server assigned', async () => {
        setAssignResult(Promise.resolve({ variant: 'quick' }));

        const { result } = renderHook(() => useExperiment('box_builder'));

        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.variant).toBe('quick');
    });

    it('falls back to control when the endpoint fails', async () => {
        setAssignResult(Promise.reject(new Error('API down')));

        const { result } = renderHook(() => useExperiment('box_builder'));

        // A broken experiment must degrade to today's shop, never to a blank
        // page or a spinner nobody can get past.
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        expect(result.current.variant).toBe('control');
    });

    it('stops loading even when the request fails', async () => {
        setAssignResult(Promise.reject(new Error('API down')));

        const { result } = renderHook(() => useExperiment('box_builder'));

        await waitFor(() => expect(result.current.isLoading).toBe(false));
    });

    it('asks for an assignment once, not once per render', async () => {
        const assign = jest.fn(() => ({ unwrap: () => Promise.resolve({ variant: 'control' }) }));
        mockAssign.mockReturnValue([assign, {}]);

        const { rerender, result } = renderHook(() => useExperiment('box_builder'));
        await waitFor(() => expect(result.current.isLoading).toBe(false));
        rerender();
        rerender();

        expect(assign).toHaveBeenCalledTimes(1);
    });

    it('does not let a lost funnel event throw at the caller', async () => {
        setAssignResult(Promise.resolve({ variant: 'quick' }));
        mockRecord.mockReturnValue([
            jest.fn(() => ({ unwrap: () => Promise.reject(new Error('blocked')) })),
            {},
        ]);

        const { result } = renderHook(() => useExperiment('box_builder'));
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        expect(() => result.current.track('builder_add_to_cart')).not.toThrow();
    });
});
