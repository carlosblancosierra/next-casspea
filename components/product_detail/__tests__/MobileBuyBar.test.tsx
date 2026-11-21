import { act, fireEvent, render, screen } from '@testing-library/react';
import MobileBuyBar, { BUY_BAR_HEIGHT_VAR } from '@/components/product_detail/MobileBuyBar';
import { track } from '@/utils/analytics';

jest.mock('@/utils/analytics', () => ({
    ...jest.requireActual('@/utils/analytics'),
    track: jest.fn(),
}));

type ObserverCallback = (entries: Array<{ isIntersecting: boolean }>) => void;
let observerCallback: ObserverCallback | null = null;

beforeEach(() => {
    observerCallback = null;
    (track as jest.Mock).mockClear();
    document.documentElement.style.removeProperty(BUY_BAR_HEIGHT_VAR);
    (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
        constructor(cb: ObserverCallback) {
            observerCallback = cb;
        }
        observe() {}
        disconnect() {}
    };
});

function setup(props: Partial<React.ComponentProps<typeof MobileBuyBar>> = {}) {
    const form = document.createElement('div');
    form.id = 'product-form';
    form.scrollIntoView = jest.fn();
    document.body.appendChild(form);
    const target = { current: form };
    render(
        <MobileBuyBar
            targetRef={target}
            productId={7}
            name="Signature Box of 15"
            price="37.50"
            isBox
            soldOut={false}
            {...props}
        />,
    );
    return form;
}

const scrollAway = () => act(() => observerCallback?.([{ isIntersecting: false }]));
const scrollToForm = () => act(() => observerCallback?.([{ isIntersecting: true }]));

describe('MobileBuyBar', () => {
    it('stays hidden while the product form is on screen', () => {
        setup();
        scrollToForm();
        expect(screen.queryByRole('region', { name: /buy/i })).not.toBeInTheDocument();
    });

    it('appears once the form has scrolled out of view, with name and price', () => {
        setup();
        scrollAway();
        const bar = screen.getByRole('region', { name: /buy/i });
        expect(bar).toHaveTextContent('Signature Box of 15');
        expect(bar).toHaveTextContent('£37.50');
        expect(bar.className).toMatch(/md:hidden/);
    });

    it('takes box shoppers back to the builder', () => {
        const form = setup();
        scrollAway();
        fireEvent.click(screen.getByRole('button', { name: 'Build your box' }));
        expect(form.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth', block: 'start' });
        expect(track).toHaveBeenCalledWith('mobile_buy_bar_click', { product_id: 7, kind: 'box' });
    });

    it('says "Order now" for products without a builder', () => {
        setup({ isBox: false });
        scrollAway();
        expect(screen.getByRole('button', { name: 'Order now' })).toBeEnabled();
    });

    it('is disabled when the product is sold out', () => {
        setup({ soldOut: true });
        scrollAway();
        expect(screen.getByRole('button', { name: 'Sold out' })).toBeDisabled();
    });

    it('lifts the WhatsApp button only while visible', () => {
        setup();
        scrollAway();
        expect(document.documentElement.style.getPropertyValue(BUY_BAR_HEIGHT_VAR)).not.toBe('');
        scrollToForm();
        expect(document.documentElement.style.getPropertyValue(BUY_BAR_HEIGHT_VAR)).toBe('');
    });

    it('strikes through the real price when the basket has a discount code', () => {
        setup({ discountedPrice: '30.00' });
        scrollAway();
        const bar = screen.getByRole('region', { name: /buy/i });
        expect(bar).toHaveTextContent('Now £30.00');
        expect(bar.querySelector('s')).toHaveTextContent('Was £37.50');
    });
});
