import { META_PIXEL_ID, toMetaParams, trackMeta } from '@/utils/metaPixel';

type TestWindow = Window & { fbq?: jest.Mock; _fbq_gtm_ids?: string[]; __casspeaMetaPixelReady?: boolean };
const w = window as TestWindow;

describe('metaPixel', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        delete w.fbq;
        delete w._fbq_gtm_ids;
        delete w.__casspeaMetaPixelReady;
    });
    afterEach(() => jest.useRealTimers());

    it('maps GA4 items to Meta contents', () => {
        expect(
            toMetaParams({
                value: 30,
                currency: 'GBP',
                items: [{ item_id: '7', price: 15, quantity: 2 }],
            }),
        ).toEqual({
            value: 30,
            currency: 'GBP',
            content_type: 'product',
            content_ids: ['7'],
            contents: [{ id: '7', quantity: 2, item_price: 15 }],
            num_items: 2,
        });
    });

    it('sends a purchase to our pixel only, with the order id as eventID', () => {
        w.fbq = jest.fn();
        w._fbq_gtm_ids = [META_PIXEL_ID];
        trackMeta('purchase', { value: 30, currency: 'GBP', transaction_id: 'cs_123' });
        expect(w.fbq).toHaveBeenCalledWith(
            'trackSingle',
            META_PIXEL_ID,
            'Purchase',
            { value: 30, currency: 'GBP' },
            { eventID: 'cs_123' },
        );
    });

    it('waits for the pixel to be initialised before sending', () => {
        trackMeta('add_to_cart', { value: 5 });
        w.fbq = jest.fn();
        jest.advanceTimersByTime(250);
        expect(w.fbq).not.toHaveBeenCalled();
        w._fbq_gtm_ids = [META_PIXEL_ID];
        jest.advanceTimersByTime(250);
        expect(w.fbq).toHaveBeenCalledWith('trackSingle', META_PIXEL_ID, 'AddToCart', { value: 5 }, undefined);
    });

    it('ignores events Meta has no equivalent for', () => {
        w.fbq = jest.fn();
        w.__casspeaMetaPixelReady = true;
        trackMeta('api_error', {});
        jest.advanceTimersByTime(1000);
        expect(w.fbq).not.toHaveBeenCalled();
    });
});
