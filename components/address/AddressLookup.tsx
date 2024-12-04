import React, { useEffect, useRef } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import clsx from 'clsx';

interface AddressLookupProps {
    onPlaceSelect: () => void;
    addressError: string;
}

const libraries: ("places")[] = ['places'];

const AddressLookup: React.FC<AddressLookupProps> = ({ onPlaceSelect, addressError }) => {
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        libraries,
    });

    useEffect(() => {
        if (isLoaded && addressInputRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
                componentRestrictions: { country: 'gb' },
                fields: [
                    'address_components',
                    'geometry',
                    'formatted_address',
                    'place_id'
                ],
                types: ['address'],
                language: 'en'
            });

            autocompleteRef.current.addListener('place_changed', onPlaceSelect);
        }
    }, [isLoaded, onPlaceSelect]);

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    return (
        <div className="space-y-1">
            <label htmlFor="address-lookup" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                Find Address *
            </label>
            <input
                ref={addressInputRef}
                type="text"
                id="address-lookup"
                placeholder="Start typing your address..."
                className={clsx(
                    "mt-0.5 block w-full rounded-md border text-sm",
                    addressError
                        ? "border-red-500"
                        : "border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600",
                    "shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                )}
                required
            />
            {addressError && (
                <p className="text-red-500 text-xs mt-0.5">{addressError}</p>
            )}
        </div>
    );
};

export default AddressLookup;
