import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PersonalizedForm from '@/components/personalized/PersonalizedForm';
import { useSendRequestMutation } from '@/redux/features/personalized/personalizedApiSlice';
import type { ChocolateTemplateDetail } from '@/types/personalized';

/**
 * BUG-05: the request went to an endpoint that did not exist and the error
 * was only logged, so the customer saw nothing either way and the request was
 * lost. The form now validates the email and says whether it worked.
 */

jest.mock('@/redux/features/personalized/personalizedApiSlice', () => ({
    useSendRequestMutation: jest.fn(),
}));
// The chocolate preview is pictures only; the request is what is under test.
jest.mock('@/components/personalized/CustomChocolate', () => ({ __esModule: true, default: () => null }));
jest.mock('@/components/personalized/ColorSelectionModal', () => ({ __esModule: true, default: () => null }));

const sendRequest = jest.fn();

const template = {
    title: 'Heart',
    slug: 'heart',
    layers: [
        {
            order: 1,
            name: null,
            layer_type: {
                name: 'Shell',
                colors: [{ name: 'Gold', slug: 'gold', hex_code: '#d4af37', top_image: '/t.png', side_image: '/s.png' }],
            },
        },
    ],
} as unknown as ChocolateTemplateDetail;

const orderDetails = { quantity: 120, selectedFlavours: [3, 5] };

describe('PersonalizedForm request', () => {
    beforeEach(() => {
        sendRequest.mockReset();
        (useSendRequestMutation as jest.Mock).mockReturnValue([sendRequest, {}]);
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => jest.restoreAllMocks());

    it('asks for a valid email before sending anything', async () => {
        render(<PersonalizedForm template={template} orderDetails={orderDetails} />);
        await userEvent.type(screen.getByLabelText('Email'), 'not-an-email');
        await userEvent.click(screen.getByRole('button', { name: 'Request Chocolates' }));

        expect(screen.getByRole('alert')).toHaveTextContent(/valid email/i);
        expect(sendRequest).not.toHaveBeenCalled();
    });

    it('sends the design and says it was received', async () => {
        sendRequest.mockReturnValue({ unwrap: () => Promise.resolve({ message: 'Request received' }) });
        render(<PersonalizedForm template={template} orderDetails={orderDetails} />);
        await userEvent.type(screen.getByLabelText('Email'), ' ada@example.com ');
        await userEvent.type(screen.getByLabelText('Comments'), 'For a wedding');
        await userEvent.click(screen.getByRole('button', { name: 'Request Chocolates' }));

        expect(sendRequest).toHaveBeenCalledWith({
            template_slug: 'heart',
            email: 'ada@example.com',
            comments: 'For a wedding',
            custom_design_names: ['Gold'],
            flavours: [3, 5],
            quantity: 120,
        });
        expect(await screen.findByRole('status')).toHaveTextContent(/we have your request.*ada@example\.com/i);
        expect(screen.queryByRole('button', { name: 'Request Chocolates' })).not.toBeInTheDocument();
    });

    it('says so when the request fails, and lets the customer try again', async () => {
        sendRequest.mockReturnValue({ unwrap: () => Promise.reject({ status: 500 }) });
        render(<PersonalizedForm template={template} orderDetails={orderDetails} />);
        await userEvent.type(screen.getByLabelText('Email'), 'ada@example.com');
        await userEvent.click(screen.getByRole('button', { name: 'Request Chocolates' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(/did not go through.*info@casspea\.co\.uk/i);
        expect(screen.getByRole('button', { name: 'Request Chocolates' })).toBeEnabled();
    });
});
