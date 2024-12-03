import React, { useEffect, useRef, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { Address } from '@/types/addresses';
import clsx from 'clsx';

const libraries: ("places")[] = ['places'];

interface AddressFormProps {
    onAddressSubmit: (address: Address) => void;
    initialData?: Address;
    addressType: 'SHIPPING' | 'BILLING';
    onFormReady?: (form: HTMLFormElement) => void;
    onFormValidityChange?: (isValid: boolean) => void;
    initialEmail?: string;
}

interface AddressData {
    first_name: string;
    last_name: string;
    email: string;
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

const AddressForm: React.FC<AddressFormProps> = ({
    onAddressSubmit,
    initialData,
    addressType,
    onFormReady,
    onFormValidityChange,
    initialEmail
}) => {
    const formRef = useRef<HTMLFormElement>(null);
    const [formData, setFormData] = useState<AddressData>({
        first_name: '',
        last_name: '',
        email: '',
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
        longitude: 0
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
                fields: [
                    'address_components',
                    'geometry',
                    'formatted_address',
                    'place_id'
                ],
                types: ['address'],
                language: 'en'
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
            // Store each component type separately
            component.types.forEach(type => {
                addressComponents[type] = component.long_name;
                addressComponents[`${type}_short`] = component.short_name;
            });

            // Check if address is in UK
            if (component.types.includes('country') && component.short_name === 'GB') {
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
            country: 'United Kingdom',
            place_id: place.place_id || '',
            formatted_address: place.formatted_address || '',
            latitude: place.geometry?.location?.lat() || 0,
            longitude: place.geometry?.location?.lng() || 0
        };

        console.log('Address Components:', addressComponents); // Debug log
        console.log('New Form Data:', newFormData); // Debug log

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

        // Combine names for backward compatibility if needed
        const dataToSubmit = {
            ...newFormData,
            full_name: `${newFormData.first_name} ${newFormData.last_name}`.trim()
        };

        // Submit to parent component whenever form data changes
        onAddressSubmit(dataToSubmit as Address);

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

    // Add useEffect to update form data when initialData changes
    useEffect(() => {
        if (initialData) {
            setFormData(prevData => ({
                ...prevData,
                ...initialData,
                // Ensure email is set from either initialData or initialEmail
                email: initialData.email || initialEmail || prevData.email
            }));
        } else if (initialEmail) {
            setFormData(prevData => ({
                ...prevData,
                email: initialEmail
            }));
        }
    }, [initialData, initialEmail]);

    return (
        <form
            ref={formRef}
            className="space-y-3"
            data-type={addressType}
            noValidate
        >
            {/* Address Lookup First */}
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

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="first_name" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                        First Name *
                    </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="last_name" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                        Last Name *
                    </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                </div>
            </div>

            <div className="space-y-1">
                <label htmlFor="email" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                    Email Address
                </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                    className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
            </div>

            {/* Make Phone Number Optional */}
            <div className="space-y-1">
                <label htmlFor="phone" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                    Phone Number
                </label>
                <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    // Removed `required` attribute
                    className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
            </div>

            {/* Address Fields Populated by Google Places */}
            <div className="space-y-1">
                <label htmlFor="street_address" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                    Street Address *
                </label>
                <input
                    type="text"
                    id="street_address"
                    name="street_address"
                    value={formData.street_address}
                    onChange={handleInputChange}
                    required
                    className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
            </div>

            <div className="space-y-1">
                <label htmlFor="street_address2" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                    Address Line 2
                </label>
                <input
                    type="text"
                    id="street_address2"
                    name="street_address2"
                    value={formData.street_address2}
                    onChange={handleInputChange}
                    className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                />
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="city" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                        City *
                    </label>
                    <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="county" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                        County
                    </label>
                    <input
                        type="text"
                        id="county"
                        name="county"
                        value={formData.county}
                        onChange={handleInputChange}
                        className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                    <label htmlFor="postcode" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                        Postcode *
                    </label>
                    <input
                        type="text"
                        id="postcode"
                        name="postcode"
                        value={formData.postcode}
                        onChange={handleInputChange}
                        required
                        className="mt-0.5 block w-full rounded-md border-gray-300 bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                </div>

                <div className="space-y-1">
                    <label htmlFor="country" className="block text-xs font-medium text-gray-700 dark:text-gray-200">
                        Country *
                    </label>
                    <input
                        type="text"
                        id="country"
                        name="country"
                        value={formData.country}
                        readOnly
                        className="mt-0.5 block w-full rounded-md border-gray-300 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                    />
                </div>
            </div>

            {addressError && (
                <div className="text-red-500 text-xs mt-0.5">
                    {addressError}
                </div>
            )}
        </form>
    );

};

export default AddressForm;

