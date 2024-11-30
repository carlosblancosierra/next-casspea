import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Address } from '@/types/addresses';

// Define libraries array outside component to prevent reloading
const libraries: ("places")[] = ['places'];

interface AddressFormProps {
    onAddressSubmit: (address: Address) => void;
    initialData?: Address;
    addressType: 'SHIPPING' | 'BILLING';
    onFormReady?: (form: HTMLFormElement) => void;
    onFormValidityChange?: (isValid: boolean) => void;
}

interface AddressData {
    full_name: string;
    phone: string;
    street_address: string;
    street_address2: string;
    city: string;
    county: string;
    postcode: string;
    country: string;
    place_id: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
}

// Validation functions
const isValidUKPostcode = (postcode: string) => {
    // const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    // return regex.test(postcode.trim());
    return true;
};

const isValidUKPhone = (phone: string) => {
    // const cleanPhone = phone.replace(/\s+/g, '');
    // const regex = /^(?:(?:\+44)|(?:0))(?:(?:(?:\d{10})|(?:\d{9})|(?:\d{8})|(?:\d{7})))$/;
    // return regex.test(cleanPhone);
    return true;
};

const AddressForm: React.FC<AddressFormProps> = ({
    onAddressSubmit,
    initialData,
    addressType,
    onFormReady,
    onFormValidityChange
}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<AddressData>({
        full_name: '',
        phone: '',
        street_address: '',
        street_address2: '',
        city: '',
        county: '',
        postcode: '',
        country: 'United Kingdom',
        place_id: '',
        formatted_address: '',
        latitude: 0,
        longitude: 0,
        ...initialData
    });

    const [addressError, setAddressError] = useState<string>('');
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    const addressInputRef = useRef<HTMLInputElement>(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
        libraries
    });

    // Notify parent component when form is ready
    useEffect(() => {
        if (formRef.current && onFormReady) {
            onFormReady(formRef.current);
        }
    }, [onFormReady]);

    useEffect(() => {
        if (isLoaded && addressInputRef.current) {
            autocompleteRef.current = new google.maps.places.Autocomplete(addressInputRef.current, {
                componentRestrictions: { country: 'gb' },
                fields: ['address_components', 'geometry', 'formatted_address', 'place_id'],
                types: ['address']
            });

            autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
        }
    }, [isLoaded]);

    const handlePlaceSelect = () => {
        if (!autocompleteRef.current) return;

        const place = autocompleteRef.current.getPlace();
        if (!place.geometry) {
            setAddressError('Please select an address from the dropdown');
            return;
        }

        // Reset error if valid place selected
        setAddressError('');

        // Extract address components
        const addressComponents: { [key: string]: string } = {};
        let isUKAddress = false;

        place.address_components?.forEach(component => {
            const type = component.types[0];
            addressComponents[type] = component.long_name;

            // Check if address is in UK
            if (type === 'country' && component.short_name === 'GB') {
                isUKAddress = true;
            }
        });

        // Show error if not UK address
        if (!isUKAddress) {
            setAddressError('Sorry, we only deliver to UK addresses');
            return;
        }

        const newFormData = {
            ...formData,
            street_address: `${addressComponents.street_number || ''} ${addressComponents.route || ''}`.trim(),
            city: addressComponents.postal_town || addressComponents.locality || '',
            county: addressComponents.administrative_area_level_2 || '',
            postcode: addressComponents.postal_code || '',
            country: addressComponents.country || 'United Kingdom',
            place_id: place.place_id || '',
            formatted_address: place.formatted_address || '',
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0
        };

        setFormData(newFormData);
        onAddressSubmit(newFormData as Address);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFormData = {
            ...formData,
            [name]: value
        };
        setFormData(newFormData);

        // Submit to parent component whenever form data changes
        onAddressSubmit(newFormData as Address);

        // Check validity
        if (onFormValidityChange && formRef.current) {
            setTimeout(() => {
                const isValid = formRef.current!.checkValidity() && !addressError;
                onFormValidityChange(isValid);
            }, 0);
        }
    };

    // Add form validity check
    useEffect(() => {
        if (formRef.current && onFormValidityChange) {
            const isValid = formRef.current.checkValidity() && !addressError;
            onFormValidityChange(isValid);
        }
    }, [formData, addressError, onFormValidityChange]);

    return (
        <form
            ref={formRef}
            className="space-y-4"
            data-type={addressType}
            noValidate
        >
            <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="address-lookup" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Find Address *
                </label>
                <input
                    ref={addressInputRef}
                    type="text"
                    id="address-lookup"
                    placeholder="Start typing your address..."
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            {/* Address fields populated by Google Places */}
            <div className="space-y-2">
                <label htmlFor="street_address" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Street Address *
                </label>
                <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="street_address2" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    Address Line 2
                </label>
                <input
                    type="text"
                    id="street_address2"
                    name="street_address2"
                    value={formData.street_address2}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        City *
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="county" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        County
                    </label>
                    <input
                        type="text"
                        id="county"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Postcode *
                    </label>
                    <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                        Country *
                    </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {addressError && (
                <div className="text-red-500 text-sm mt-2">
                    {addressError}
                </div>
            )}
        </form>
    );

};

export default AddressForm;

