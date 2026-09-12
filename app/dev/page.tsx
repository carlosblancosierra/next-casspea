import { notFound } from 'next/navigation';
import ShippingDateTest from './ShippingDateTest';
import FlavourGridPreview from './FlavourGridPreview';

export default function DevPage() {
    if (process.env.NODE_ENV !== 'development') {
        notFound();
    }
    return (
        <>
            <FlavourGridPreview />
            <ShippingDateTest />
        </>
    );
}
