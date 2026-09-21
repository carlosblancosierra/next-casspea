import { render, screen } from '@testing-library/react';
import FlavourNameGrid from '@/components/flavours/FlavourNameGrid';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import type { Flavour } from '@/types/flavours';

jest.mock('@/redux/features/flavour/flavourApiSlice', () => ({
    useGetFlavoursQuery: jest.fn(),
}));

const mockFlavours = useGetFlavoursQuery as jest.Mock;

const flavours = [
    { id: 1, name: 'Salted Caramel', image: '/f/1.png', mini_description: 'Buttery' },
    {
        id: 2,
        name: '64% Colombian Dark Chocolate Ganache With Raspberry',
        image: '/f/2.png',
        mini_description: 'Sharp and dark',
    },
    { id: 3, name: 'Gin', image: '/f/3.png' },
] as unknown as Flavour[];

describe('FlavourNameGrid', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockFlavours.mockReturnValue({ data: flavours });
    });

    it('makes each cell span the grid rows itself, with no wrapper in between', () => {
        // A wrapper div would be one grid item in the first track and the
        // subgrid would have nothing to align — which is what made long names
        // push the descriptions in their row out of line.
        render(<FlavourNameGrid flavours={flavours} showDescription />);

        const cell = screen.getByRole('button', { name: 'Salted Caramel' });
        expect(cell.className).toContain('row-span-3');
        expect(cell.className).toContain('grid-rows-[subgrid]');

        expect(cell.children).toHaveLength(3);
        expect(cell.children[1].tagName).toBe('H3');
        expect(cell.children[2].tagName).toBe('P');
    });

    it('reserves the description row even for a flavour that has none', () => {
        render(<FlavourNameGrid flavours={flavours} showDescription />);

        const gin = screen.getByRole('button', { name: 'Gin' });
        expect(gin.children).toHaveLength(3);
    });

    it('still renders every flavour name', () => {
        render(<FlavourNameGrid flavours={flavours} />);

        expect(screen.getByText('Salted Caramel')).toBeInTheDocument();
        expect(screen.getByText('Gin')).toBeInTheDocument();
    });
});
