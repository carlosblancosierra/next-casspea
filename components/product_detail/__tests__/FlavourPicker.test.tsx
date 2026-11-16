import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FlavourPicker from '@/components/product_detail/FlavourPicker';
import type { Flavour } from '@/types/flavours';
import type { CartItemBoxFlavorSelection } from '@/types/carts';

jest.mock('@/redux/features/flavour/flavourApiSlice', () => ({
    useGetFlavoursQuery: () => ({ data: undefined, isLoading: false, error: undefined }),
}));
jest.mock('next/image', () => ({ __esModule: true, default: () => null }));

const flavour = (id: number, name: string) =>
    ({ id, name, slug: name.toLowerCase(), description: '', mini_description: '' }) as Flavour;
const CARAMEL = flavour(1, 'Caramel');
const PRALINE = flavour(2, 'Praline');

/** The real parents own the selection; this mirrors ProductFormBoxes closely enough. */
function Harness({ max, initial = [] }: { max: number; initial?: CartItemBoxFlavorSelection[] }) {
    const [flavours, setFlavours] = useState<CartItemBoxFlavorSelection[]>(initial);
    const used = flavours.reduce((n, f) => n + f.quantity, 0);
    const remaining = max - used;
    const change = (index: number, _field: 'quantity', value: number) =>
        setFlavours(prev => prev.map((f, i) => (i === index ? { ...f, quantity: value } : f)));
    return (
        <FlavourPicker
            flavours={flavours}
            remainingChocolates={remaining}
            maxChocolates={max}
            handleAddFlavour={f => setFlavours(prev => [...prev, { flavor: f, quantity: 1 } as CartItemBoxFlavorSelection])}
            handleFlavourChange={change}
            incrementQuantity={i => remaining > 0 && change(i, 'quantity', flavours[i].quantity + 1)}
            decrementQuantity={i => change(i, 'quantity', flavours[i].quantity - 1)}
            deleteFlavour={i => setFlavours(prev => prev.filter((_, j) => j !== i))}
            handleDeleteAllFlavours={() => setFlavours([])}
            selectedAllergens={[]}
            availableFlavours={[CARAMEL, PRALINE]}
        />
    );
}

const openModal = () => fireEvent.click(screen.getByRole('button', { name: 'Add Flavour' }));
const modalCard = (name: string) => screen.getAllByRole('heading', { name })[0].closest('.flavour-card') as HTMLElement;

describe('FlavourPicker', () => {
    it('adds five of a new flavour in one tap on a big box', () => {
        render(<Harness max={48} />);
        openModal();
        fireEvent.click(screen.getByRole('button', { name: 'Add 5 Caramel' }));
        expect(modalCard('Caramel')).toHaveTextContent('5');
        expect(screen.getByText('5 of 48 chocolates selected')).toBeInTheDocument();
    });

    it('never adds more than the box has room for', () => {
        render(<Harness max={24} initial={[{ flavor: PRALINE, quantity: 22 } as CartItemBoxFlavorSelection]} />);
        openModal();
        fireEvent.click(screen.getByRole('button', { name: 'Add 2 Caramel' }));
        expect(screen.getByText(/Your box is full/)).toBeInTheDocument();
    });

    it('disables every "+" once the box is full and says why', () => {
        // The "+" used to stay enabled and silently do nothing on a full box,
        // which is where most of the rage clicks came from.
        render(<Harness max={9} initial={[{ flavor: CARAMEL, quantity: 8 } as CartItemBoxFlavorSelection]} />);
        openModal();
        fireEvent.click(screen.getAllByRole('button', { name: 'Add one Caramel' })[1]);
        screen.getAllByRole('button', { name: /^Add one/ }).forEach(b => expect(b).toBeDisabled());
        expect(screen.getByText(/Your box is full/)).toBeInTheDocument();
    });

    it('keeps "+5" off small boxes', () => {
        render(<Harness max={9} />);
        openModal();
        expect(screen.queryByRole('button', { name: /Add 5/ })).not.toBeInTheDocument();
    });
});
