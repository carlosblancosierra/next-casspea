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
    is_active?: boolean;
    created?: string;
    updated?: string;
    session_key?: string;
    email?: string;
    first_name?: string;
    last_name?: string;
}

// Matches AddressStatsView: [{"postcode": "SW1A 1AA", "count": 3}, ...]
export interface AddressPostcodeStat {
    postcode: string;
    count: number;
}

// Matches SmsContactsView. One entry per distinct UK mobile, so it is people
// we could text rather than address rows (checkout writes up to two rows per
// attempt and nothing deduplicates them). Phone is E.164, which is also what
// Mailchimp wants for SMS.
export interface SmsContact {
    phone: string;
    first_name: string;
    last_name: string;
    first_seen: string;
}

export interface SmsContactsResponse {
    total: number;
    new_last_30_days: number;
    contacts: SmsContact[];
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
