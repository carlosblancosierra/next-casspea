import { render, screen, fireEvent } from '@testing-library/react';
import ClientFlavourRow from '@/components/client-portal/ClientFlavourRow';

jest.mock('next/image', () => ({ __esModule: true, default: () => null }));

describe('ClientFlavourRow', () => {
    it('adds five steps at once for bulk orders', () => {
        const onChange = jest.fn();
        render(<ClientFlavourRow name="Brownie" quantity={20} step={10} unitPrice={1} onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: 'Add 50 Brownie' }));
        expect(onChange).toHaveBeenCalledWith(70);
    });

    it('has no big step when items are sold one at a time', () => {
        render(<ClientFlavourRow name="Box of 9" quantity={0} step={1} unitPrice={30} onChange={jest.fn()} />);
        expect(screen.queryByRole('button', { name: /Add 5 / })).not.toBeInTheDocument();
    });
});
