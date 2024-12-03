export type AddressType = 'SHIPPING' | 'BILLING';

export interface Address {
    id?: number;
    user?: number;
    address_type: AddressType;
    full_name: string;
    phone: string;
    street_address: string;
    street_address2?: string;
    city: string;
    county?: string;
    postcode: string;
    country: string;
    place_id?: string;
    formatted_address?: string;
    latitude?: number;
    longitude?: number;
    is_a?: boolean;
    created?: string;
    updated?: string;
    session_key?: string;
}

export interface AddressRequest {
    shipping_address: {
        full_name: string;
        phone: string;
        street_address: string;
        street_address2?: string;
        city: string;
        county?: string;
        postcode: string;
        country: string;
        place_id?: string;
        formatted_address?: string;
        latitude?: number;
        longitude?: number;
        address_type: AddressType;
    };
    billing_address: {
        full_name: string;
        phone: string;
        street_address: string;
        street_address2?: string;
        city: string;
        county?: string;
        postcode: string;
        country: string;
        place_id?: string;
        formatted_address?: string;
        latitude?: number;
        longitude?: number;
        address_type: AddressType;
    };
}

export interface AddressResponse {
    shipping_address?: Address;
    billing_address?: Address;
}

// Validation error response type
export interface AddressError {
    shipping_address?: {
        [key: string]: string[];
    };
    billing_address?: {
        [key: string]: string[];
    };
    [key: string]: unknown;
}
