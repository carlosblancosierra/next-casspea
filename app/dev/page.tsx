import { notFound } from 'next/navigation';
import ShippingDateTest from './ShippingDateTest';

export default function DevPage() {
    if (process.env.NODE_ENV !== 'development') {
        notFound();
    }
    return <ShippingDateTest />;
}
