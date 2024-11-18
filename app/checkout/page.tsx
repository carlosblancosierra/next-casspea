'use client';

import AddressForm from '@/components/address/AddressForm';

export default function Page() {
    return (
        <>
            <main className='mx-auto max-w-screen-2xl md:py-6 md:py-8 py-4 sm:px-6 lg:px-8'>
                <AddressForm onAddressSubmit={() => { }} />
            </main>
        </>
    );
}
