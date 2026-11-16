import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { Product } from '@/types/products';
import type { Flavour } from '@/types/flavours';
import AdventLanding, { adventImages, adventMetadata, priceOf } from '../AdventLanding';
import { ORDER_DEADLINE, adventHref } from '../content';

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
jest.mock('@/redux/features/flavour/flavourApiSlice', () => ({ useGetShowcaseFlavoursQuery: () => ({ data: undefined }) }));
jest.mock('@/utils/products', () => ({ getProduct: jest.fn() }));
jest.mock('@/utils/flavours', () => ({ ...jest.requireActual('@/utils/flavours'), getFlavours: jest.fn() }));

const product = (overrides: Partial<Product> = {}): Product =>
    ({ id: 42, name: 'Advent Calendar 2026', slug: 'advent-calendar', base_price: '59.99', active: true, sold_out: false, ...overrides }) as Product;

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
        render(<AdventLanding variant="shop" product={product({ base_price: '61.50' })} />);

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
            'Questions',
            '24 Doors. 3 Secrets. One Decision.',
        ]);
    });

    it('describes the product for search engines', () => {
        const { container } = render(<AdventLanding variant="shop" product={product()} />);
        const data = jsonLd(container);
        expect(data['@type']).toBe('Product');
        expect(data.brand.name).toBe('CassPea');
        expect(data.offers).toMatchObject({ price: '59.99', priceCurrency: 'GBP', availability: 'https://schema.org/InStock' });
        expect(data.aggregateRating).toMatchObject({ ratingValue: '4.6' });
    });

    it('hides the bonus row until it is confirmed', () => {
        render(<AdventLanding variant="shop" product={product()} />);
        expect(screen.queryByText('Bonus')).not.toBeInTheDocument();
    });

    it('adds the calendar to the cart and goes to the cart', async () => {
        render(<AdventLanding variant="shop" product={product()} />);
        fireEvent.click(screen.getAllByRole('button', { name: /Reserve My Calendar/ })[0]);
        await waitFor(() => expect(push).toHaveBeenCalledWith('/cart'));
        expect(addToCart).toHaveBeenCalledWith({ product: 42, quantity: 1 });
    });

    it('tags a reminder sign-up with the campaign and where it came from', async () => {
        render(<AdventLanding variant="shop" product={product()} />);
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
        const { container } = render(<AdventLanding variant="shop" product={product({ sold_out: true })} />);
        expect(screen.getAllByRole('button', { name: 'Sold out' })[0]).toBeDisabled();
        expect(jsonLd(container).offers.availability).toBe('https://schema.org/OutOfStock');
    });

    it('still sells, via the product page, when the API did not answer', () => {
        render(<AdventLanding variant="shop" product={null} />);
        expect(screen.getAllByText(/£59\.99/).length).toBeGreaterThan(0);
        expect(screen.getAllByRole('link', { name: /Reserve My Calendar/ })[0]).toHaveAttribute('href', '/shop-now/advent-calendar');
    });

    it('links team orders to WhatsApp', () => {
        render(<AdventLanding variant="shop" product={product()} />);
        expect(screen.getByRole('link', { name: /Get in touch/ }).getAttribute('href')).toMatch(/^https:\/\/wa\.me\/447859790386\?text=/);
    });
});

describe('AdventLanding, lead variant', () => {
    it('asks for an email in the hero and shows the buy button once subscribed', async () => {
        render(<AdventLanding variant="lead" product={product()} />);
        expect(screen.queryByText(/Not ready yet/)).not.toBeInTheDocument();
        const before = screen.getAllByRole('button', { name: /Reserve My Calendar/ }).length;

        fireEvent.change(screen.getByLabelText('Email address'), { target: { value: 'b@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: 'Get early access' }));

        await screen.findByText(/You're in/);
        expect(subscribe).toHaveBeenCalledWith(expect.objectContaining({ source: 'early-access', form_code: 'advent-2026' }));
        expect(screen.getAllByRole('button', { name: /Reserve My Calendar/ })).toHaveLength(before + 1);
    });

    it('is kept out of search and points at the shop page', () => {
        expect(adventMetadata('lead')).toMatchObject({ robots: { index: false }, alternates: { canonical: '/advent-calendar' } });
        // Not launched yet, so the shop page is kept out of search too.
        expect(adventMetadata('shop').robots).toEqual({ index: false, follow: false });
        expect(adventMetadata('shop').openGraph).toMatchObject({ images: [expect.objectContaining({ url: '/advent/og.jpg' })] });
    });
});

describe('the countdown', () => {
    it('switches to the late-order policy once the window has closed', () => {
        jest.useFakeTimers().setSystemTime(ORDER_DEADLINE.getTime() + 60_000);
        render(<AdventLanding variant="shop" product={product()} />);
        expect(screen.getByText('The 1 December order window has closed')).toBeInTheDocument();
        expect(screen.getAllByText(/can't guarantee when it will arrive/).length).toBeGreaterThan(0);
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

describe('content from the API', () => {
    const photos = { image: 'https://casspea-v2.s3.amazonaws.com/a1.jpg', gallery_images: [{ id: 1, image: 'https://casspea-v2.s3.amazonaws.com/a2.jpg', thumbnail: '' }] };

    it('uses photo 1 for the hero and sharing, and the rest as uncropped bands', () => {
        expect(adventImages(product(photos))).toEqual({ hero: photos.image, bands: [photos.gallery_images[0].image], og: photos.image });
        expect(adventImages(null)).toEqual({ hero: '/advent/hero.jpg', bands: [], og: '/advent/og.jpg' });
        expect(adventMetadata('shop', product(photos)).openGraph).toMatchObject({ images: [expect.objectContaining({ url: photos.image })] });
    });

    it('shows every product photo once, in order', () => {
        const four = product({
            image: 'https://casspea-v2.s3.amazonaws.com/1.jpg',
            gallery_images: ['1', '2', '3', '4'].map((n, id) => ({ id, image: `https://casspea-v2.s3.amazonaws.com/${n}.jpg`, thumbnail: '' })),
        });
        render(<AdventLanding variant="shop" product={four} />);
        const srcs = screen.getAllByRole('img').map(img => decodeURIComponent(img.getAttribute('src') ?? ''));
        expect(['1', '2', '3', '4'].map(n => srcs.filter(src => src.includes(`amazonaws.com/${n}.jpg`)).length)).toEqual([1, 1, 1, 1]);
    });

    it('shows the grid of every flavour', () => {
        const f = { id: 9, name: 'Salted Caramel', slug: 'salted-caramel', description: '', mini_description: '' } as Flavour;
        render(<AdventLanding variant="shop" product={product()} flavours={[f]} />);
        expect(screen.getByRole('heading', { level: 2, name: 'All Our Flavours' })).toBeInTheDocument();
        expect(screen.getByText('Salted Caramel')).toBeInTheDocument();
    });

    it('shows the Christmas flavours as the exclusives', () => {
        const flavour = (name: string) => ({ id: 1, name, slug: name, description: '', mini_description: '', image: 'https://casspea-v2.s3.amazonaws.com/f.jpg' }) as Flavour;
        render(<AdventLanding variant="shop" product={product()} exclusives={[flavour('Mince Pie'), flavour('Mulled Wine'), flavour('Gingerbread')]} />);
        expect(screen.getByAltText('Mince Pie')).toBeInTheDocument();
        expect(screen.getByText('Gingerbread')).toBeInTheDocument();
    });

    it('quotes real Trustpilot reviews', () => {
        render(<AdventLanding variant="shop" product={product()} />);
        expect(screen.getByText('Kim')).toBeInTheDocument();
        expect(screen.queryByText(/Real Trustpilot quote/)).not.toBeInTheDocument();
    });
});

describe('allergens', () => {
    it('asks for allergens before adding the calendar, and sends them', async () => {
        render(<AdventLanding variant="shop" product={product({ can_pick_allergens: true })} />);
        fireEvent.click(screen.getAllByRole('button', { name: /Reserve My Calendar/ })[0]);
        expect(addToCart).not.toHaveBeenCalled();

        const confirm = await screen.findByRole('button', { name: 'Add to basket' });
        expect(confirm).toBeDisabled();
        fireEvent.click(screen.getByText('No Allergens'));
        fireEvent.click(confirm);

        await waitFor(() =>
            expect(addToCart).toHaveBeenCalledWith({ product: 42, quantity: 1, box_customization: { allergens: [] } }),
        );
    });
});

describe('switching the landing live', () => {
    it('is indexed only when live, and only the shop variant', () => {
        expect(adventMetadata('shop', null, true).robots).toBeUndefined();
        expect(adventMetadata('lead', null, true).robots).toEqual({ index: false, follow: true });
        expect(adventMetadata('shop', null, false).robots).toEqual({ index: false, follow: false });
    });

    it('points the shop at the landing once live, else at the product page', () => {
        expect(adventHref(true)).toBe('/advent-calendar');
        expect(adventHref(false)).toBe('/shop-now/advent-calendar');
    });
});
