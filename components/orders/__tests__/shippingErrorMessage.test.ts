import { shippingErrorMessage } from '@/components/orders/useOrderActions';

jest.mock('@/redux/features/royalmail/royalmailApiSlice', () => ({
    useCreateRoyalMailOrderMutation: jest.fn(),
}));

describe('shippingErrorMessage', () => {
    it("shows the API's refusal for a store collection", () => {
        const err = { status: 400, data: { error: 'This order is collected in store, so it does not need a Royal Mail shipment.' } };
        expect(shippingErrorMessage(err)).toBe(
            'Error al crear envío: This order is collected in store, so it does not need a Royal Mail shipment.',
        );
    });

    it("adds Royal Mail's own reason when there is one", () => {
        const err = {
            status: 400,
            data: { error: 'No tracking number received from Royal Mail', detail: "Service code 'store' could not be found" },
        };
        expect(shippingErrorMessage(err)).toBe(
            "Error al crear envío: No tracking number received from Royal Mail — Service code 'store' could not be found",
        );
    });

    it('falls back to a generic message', () => {
        expect(shippingErrorMessage(undefined)).toBe('Error al crear envío');
        expect(shippingErrorMessage({ status: 'FETCH_ERROR', error: 'offline' })).toBe('Error al crear envío');
    });
});
