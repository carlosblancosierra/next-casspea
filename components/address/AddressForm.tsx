'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Address } from '@/types/addresses';
import FormInput from './FormInput';
import FormSection from './FormSection';

interface AddressFormProps {
    onAddressSubmit: (address: Address) => void;
    initialData?: Address;
    addressType: 'SHIPPING' | 'BILLING';
    onFormReady?: (form: HTMLFormElement) => void;
    onFormValidityChange?: (isValid: boolean) => void;
    initialEmail?: string;
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
    const [formData, setFormData] = useState<Address>({
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
        longitude: 0,
        address_type: addressType
    });

    useEffect(() => {
        if (formRef.current && onFormReady) onFormReady(formRef.current);
    }, [onFormReady]);

    useEffect(() => {
        if (initialData || initialEmail) {
            setFormData(prevData => ({
                ...prevData,
                ...initialData,
                email: initialData?.email || initialEmail || prevData.email
            }));
        }
    }, [initialData, initialEmail]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevData => {
            const newFormData = { ...prevData, [name]: value };
            onAddressSubmit({ ...newFormData, full_name: `${newFormData.first_name} ${newFormData.last_name}`.trim() });
            return newFormData;
        });
        if (onFormValidityChange && formRef.current) {
            setTimeout(() => {
                const isValid = formRef.current!.checkValidity();
                onFormValidityChange(isValid);
            }, 0);
        }
    };

    return (
        <form ref={formRef} className="space-y-3" data-type={addressType} noValidate>
            <FormSection>
                <FormInput id="first_name" name="first_name" label="First Name" value={formData.first_name || ''} onChange={handleInputChange} required />
                <FormInput id="last_name" name="last_name" label="Last Name" value={formData.last_name || ''} onChange={handleInputChange} required />
            </FormSection>
            <FormInput id="email" name="email" type="email" label="Email Address" value={formData.email || ''} onChange={handleInputChange}
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required />
            <FormInput id="phone" name="phone" type="tel" label="Phone Number" value={formData.phone} onChange={handleInputChange} />
            <FormInput id="street_address" name="street_address" label="Street Address" value={formData.street_address} onChange={handleInputChange} required />
            <FormInput id="street_address2" name="street_address2" label="Address Line 2" value={formData.street_address2 || ''} onChange={handleInputChange} />
            <FormSection>
                <FormInput id="city" name="city" label="City" value={formData.city} onChange={handleInputChange} required />
                <FormInput id="county" name="county" label="County" value={formData.county || ''} onChange={handleInputChange} />
            </FormSection>
            <FormSection>
                <FormInput id="postcode" name="postcode" label="Postcode" value={formData.postcode} onChange={handleInputChange} required />
                <FormInput id="country" name="country" label="Country" value={formData.country} readOnly />
            </FormSection>
        </form>
    );
};

export default AddressForm;

