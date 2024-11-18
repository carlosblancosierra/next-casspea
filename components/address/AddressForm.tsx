import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';


interface AddressFormProps {
    onAddressSubmit: (addressData: AddressData) => void;
    initialData?: AddressData;
    buttonText?: string;
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

// Add these validation functions at the top
const isValidUKPostcode = (postcode: string) => {
    const regex = /^[A-Z]{1,2}[0-9][A-Z0-9]? ?[0-9][A-Z]{2}$/i;
    return regex.test(postcode.trim());
};

const isValidUKPhone = (phone: string) => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const regex = /^(?:(?:\+44)|(?:0))(?:(?:(?:\d{10})|(?:\d{9})|(?:\d{8})|(?:\d{7})))$/;
    return regex.test(cleanPhone);
};

const AddressForm: React.FC<AddressFormProps> = ({
    onAddressSubmit,
    initialData,
    buttonText = 'Save Address'
}) => {
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
        libraries: ['places']
    });

    if (loadError) {
        console.error('Google Maps load error:', loadError);
    }

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

        setFormData(prev => ({
            ...prev,
            street_address: `${addressComponents.street_number || ''} ${addressComponents.route || ''}`.trim(),
            city: addressComponents.postal_town || addressComponents.locality || '',
            county: addressComponents.administrative_area_level_2 || '',
            postcode: addressComponents.postal_code || '',
            country: addressComponents.country || 'United Kingdom',
            place_id: place.place_id || '',
            formatted_address: place.formatted_address || '',
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!formData.place_id) {
            setAddressError('Please select an address from the dropdown');
            return;
        }

        if (!formData.full_name || !formData.phone) {
            setAddressError('Please fill in all required fields');
            return;
        }

        // Validate UK postcode
        if (!isValidUKPostcode(formData.postcode)) {
            setAddressError('Please enter a valid UK postcode');
            return;
        }

        // Validate UK phone number
        if (!isValidUKPhone(formData.phone)) {
            setAddressError('Please enter a valid UK phone number');
            return;
        }

        onAddressSubmit(formData);
    };

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading...</div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Full Name *
                </label>
                <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number *
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="address-lookup" className="block text-sm font-medium text-gray-700">
                    Find Address *
                </label>
                <input
                    ref={addressInputRef}
                    type="text"
                    id="address-lookup"
                    placeholder="Start typing your address..."
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            {/* Address fields populated by Google Places */}
            <div className="space-y-2">
                <label htmlFor="street_address" className="block text-sm font-medium text-gray-700">
                    Street Address *
                </label>
                <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="street_address2" className="block text-sm font-medium text-gray-700">
                    Address Line 2
                </label>
                <input
                    type="text"
                    id="street_address2"
                    name="street_address2"
                    value={formData.street_address2}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City *
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="county" className="block text-sm font-medium text-gray-700">
                        County
                    </label>
                    <input
                        type="text"
                        id="county"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700">
                        Postcode *
                    </label>
                    <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                        Country *
                    </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        readOnly
                        className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            {addressError && (
                <div className="text-red-500 text-sm mt-2">
                    {addressError}
                </div>
            )}

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {buttonText}
            </button>
        </form>
    );
};

export default AddressForm;

