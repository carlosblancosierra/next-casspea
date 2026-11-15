import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Flavour } from '@/types/flavours';
import type { Product } from '@/types/products';
import AdventLanding, { adventImages, adventMetadata, priceOf } from '../AdventLanding';
import { ORDER_DEADLINE } from '../content';

const subscribe = jest.fn();
const addToCart = jest.fn();
const push = jest.fn();

jest.mock('next/navigation', () => ({ useRouter: () => ({ push }), usePathname: () => '/advent-calendar' }));
jest.mock('react-toastify', () => ({ toast: { success: jest.fn(), error: jest.fn() } }));
jest.mock('@/redux/features/subscribe/subscribeApiSlice', () => ({
    useSubscribeGenericLeadMutation: () => [subscribe, { isLoading: false }],
}));
jest.mock('@/redux/features/carts/cartApiSlice', () => ({
    useAddCartItemMutation: () => [addToCart, { isLoading: false }],
}));
jest.mock('@/utils/products', () => ({ getProduct: jest.fn() }));

const product = (overrides: Partial<Product> = {}): Product =>
    ({ id: 42, name: 'Advent Calendar 2026', slug: 'advent-calendar', base_price: '59.99', active: true, sold_out: false, ...overrides }) as Product;

// As the API sends them: the Advent landing's flavour category, oldest first.
const FLAVOURS = [
    { id: 220, name: 'Earl Grey', slug: 'earl-grey', description: '', mini_description: 'A fragrant ganache with delicate notes of bergamot.', active: false },
    { id: 221, name: 'Crunchy Berry', slug: 'crunchy-berry', description: '', mini_description: 'Bright, festive berries.', active: false },
    { id: 222, name: 'Peppermint', slug: 'peppermint', description: '', mini_description: 'Cool, fresh peppermint.', active: false },
] as Flavour[];

const jsonLd = (container: HTMLElement) =>
    JSON.parse(container.querySelector('script[type="application/ld+json"]')!.innerHTML);

beforeEach(() => {
    jest.clearAllMocks();
    subscribe.mockReturnValue({ unwrap: () => Promise.resolve({ message: 'ok' }) });
    addToCart.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    window.localStorage.clear();
});

describe('AdventLanding, shop variant', () => {
    it('renders the heading, the price from the API and the sections in order', () => {
        render(<AdventLanding variant="shop" product={product({ base_price: '61.50' })} flavours={FLAVOURS} />);

        expect(screen.getByRole('heading', { level: 1, name: 'Twenty-four mornings of edible art.' })).toBeInTheDocument();
        expect(screen.getAllByText(/£61\.50/).length).toBeGreaterThan(0);
        const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent);
        expect(headings).toEqual([
            'Most Advent Calendars Are Forgotten by Day Six',
            'Everything You Get',
            'Three Flavours. Only Behind These Doors.',
            "The Easiest Gift You'll Buy This Year",
            "Who It's For",
            "Not ready yet? We'll remind you before 26 November",
            'Cass and Pea Are Our Daughters',
            "Loved Before They're Even Eaten",
            'The Door-to-Door Promise',
            'Questions',
            '24 Doors. 3 Secrets. One Decision.',
        ]);
    });

    it('describes the product for search engines', () => {
        const { container } = render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        const data = jsonLd(container);
        expect(data['@type']).toBe('Product');
        expect(data.brand.name).toBe('CassPea');
        expect(data.offers).toMatchObject({ price: '59.99', priceCurrency: 'GBP', availability: 'https://schema.org/InStock' });
        expect(data.aggregateRating).toMatchObject({ ratingValue: '4.6' });
    });

    it('hides the bonus row until it is confirmed', () => {
        render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        expect(screen.queryByText('Bonus')).not.toBeInTheDocument();
    });

    it('adds the calendar to the cart and goes to the cart', async () => {
        render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        fireEvent.click(screen.getAllByRole('button', { name: /Reserve My Calendar/ })[0]);
        await waitFor(() => expect(push).toHaveBeenCalledWith('/cart'));
        expect(addToCart).toHaveBeenCalledWith({ product: 42, quantity: 1 });
    });

    it('tags a reminder sign-up with the campaign and where it came from', async () => {
        render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'a@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Remind me' }));
        await screen.findByText("Done. We'll email you before 26 November.");
        expect(subscribe).toHaveBeenCalledWith({
            email: 'a@example.com',
            form_code: 'advent-2026',
            source: 'landing-reminder',
            lead_type: 'landing_page',
        });
    });

    it('says sold out, and tells search engines, when the API does', () => {
        const { container } = render(<AdventLanding variant="shop" product={product({ sold_out: true })} flavours={FLAVOURS} />);
        expect(screen.getAllByRole('button', { name: 'Sold out' })[0]).toBeDisabled();
        expect(jsonLd(container).offers.availability).toBe('https://schema.org/OutOfStock');
    });

    it('still sells, via the product page, when the API did not answer', () => {
        render(<AdventLanding variant="shop" product={null} flavours={FLAVOURS} />);
        expect(screen.getAllByText(/£59\.99/).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /Reserve My Calendar/ })[0]).toHaveAttribute('href', '/shop-now/advent-calendar');
    });

    it('links team orders to WhatsApp', () => {
        render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        expect(screen.getByRole('link', { name: /Get in touch/ }).getAttribute('href')).toMatch(/^https:\/\/wa\.me\/447859790386\?text=/);
    });
});

describe('AdventLanding, lead variant', () => {
    it('asks for an email in the hero and shows the buy button once subscribed', async () => {
        render(<AdventLanding variant="lead" product={product()} flavours={FLAVOURS} />);
        expect(screen.queryByText(/Not ready yet/)).not.toBeInTheDocument();
        const before = screen.getAllByRole('button', { name: /Reserve My Calendar/ }).length;

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'b@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Get early access' }));

        await screen.findByText(/You're in/);
        expect(subscribe).toHaveBeenCalledWith(expect.objectContaining({ source: 'early-access', form_code: 'advent-2026' }));
        expect(screen.getAllByRole('button', { name: /Reserve My Calendar/ })).toHaveLength(before + 1);
    });

    it('is kept out of search and points at the shop page', () => {
        const live = { live: true, product: product({ image: 'https://cdn.test/advent.jpg' }) };
        expect(adventMetadata('lead', live)).toMatchObject({ robots: { index: false }, alternates: { canonical: '/advent-calendar' } });
        expect(adventMetadata('shop', live).robots).toBeUndefined();
        expect(adventMetadata('shop', live).openGraph).toMatchObject({ images: [expect.objectContaining({ url: 'https://cdn.test/advent.jpg' })] });
    });
});

describe('before the landing is live', () => {
    it('keeps both variants out of search', () => {
        expect(adventMetadata('shop', { live: false, product: null }).robots).toEqual({ index: false, follow: false });
        expect(adventMetadata('lead', { live: false, product: null }).robots).toEqual({ index: false, follow: false });
    });
});

describe('photos from the API', () => {
    it('uses the main photo for the hero and the last gallery photo for the story', () => {
        const p = product({
            image: 'https://cdn.test/main.jpg',
            gallery_images: [
                { id: 1, image: 'https://cdn.test/g1.jpg', thumbnail: '' },
                { id: 2, image: 'https://cdn.test/g2.jpg', thumbnail: '' },
            ],
        });
        expect(adventImages(p)).toEqual({ hero: 'https://cdn.test/main.jpg', story: 'https://cdn.test/g2.jpg' });
        expect(adventImages(product({ image: 'https://cdn.test/main.jpg' }))).toEqual({ hero: 'https://cdn.test/main.jpg', story: 'https://cdn.test/main.jpg' });
        expect(adventImages(null)).toEqual({ hero: null, story: null });
    });
});

describe('the three calendar-only flavours', () => {
    it('lists the flavours the API sends, in its order, with their descriptions', () => {
        render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        for (const name of ['Earl Grey', 'Crunchy Berry', 'Peppermint']) {
            expect(screen.getByText(name)).toBeInTheDocument();
        }
        expect(screen.getByText('A fragrant ganache with delicate notes of bergamot.')).toBeInTheDocument();
        expect(screen.getAllByRole('heading', { level: 3, name: /^Exclusive no\. / }).map(h => h.textContent))
            .toEqual(['Exclusive no. 1', 'Exclusive no. 2', 'Exclusive no. 3']);
    });

    it('leaves the section out when the API has no flavours', () => {
        render(<AdventLanding variant="shop" product={product()} flavours={[]} />);
        expect(screen.queryByText('Three Flavours. Only Behind These Doors.')).not.toBeInTheDocument();
    });
});

describe('reviews', () => {
    it('quotes three real Trustpilot reviews and counts 80 of them', () => {
        render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        expect(screen.getByText('Lesley Campbell, on Trustpilot')).toBeInTheDocument();
        expect(screen.queryByText(/Real Trustpilot quote/)).not.toBeInTheDocument();
        expect(screen.getAllByText(/\(80 reviews\)/).length).toBeGreaterThan(0);
    });
});

describe('the countdown', () => {
    it('switches to the late-order policy once the window has closed', () => {
        jest.useFakeTimers().setSystemTime(ORDER_DEADLINE.getTime() + 60_000);
        render(<AdventLanding variant="shop" product={product()} flavours={FLAVOURS} />);
        expect(screen.getByText('The 1 December order window has closed')).toBeInTheDocument();
        expect(screen.getAllByText(/LATE-ORDER POLICY/).length).toBeGreaterThan(0);
        jest.useRealTimers();
    });
});

describe('priceOf', () => {
    it('prefers the current price, then the base price, then the launch price', () => {
        expect(priceOf(product({ current_price: '49.99' }))).toBe('49.99');
        expect(priceOf(product())).toBe('59.99');
        expect(priceOf(null)).toBe('59.99');
    });
});
