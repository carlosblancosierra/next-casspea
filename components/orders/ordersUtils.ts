import { Address } from '@/types/addresses';
import { Order } from '@/types/orders';
import { Product } from '@/types/products';

export const formatDate = (dateString?: string): { date: string, time: string } => {
    if (!dateString) return { date: '-', time: '-' };
    try {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-GB'),
            time: date.toLocaleTimeString('en-GB')
        };
    } catch (error) {
        console.error('Date formatting error:', error);
        return { date: '-', time: '-' };
    }
};

export const formatCurrency = (amount?: string): string => {
    if (!amount) return '£0.00';
    try {
        return `£${parseFloat(amount).toFixed(2)}`;
    } catch (error) {
        console.error('Currency formatting error:', error);
        return '£0.00';
    }
};

export const getAllergenName = (id: number): string => {
    const allergenMap: Record<number, string> = {
        1: 'Gluten',
        2: 'Nut',
        3: 'Dairy'
        // Add other allergen mappings as needed
    };
    return allergenMap[id] || 'Unknown';
};

export const formatSelectionType = (type?: string): string => {
    switch (type) {
        case 'RANDOM':
            return 'Surprise Me';
        case 'PICK_AND_MIX':
            return 'Pick & Mix';
        default:
            return type || 'Not specified';
    }
};

export const formatShippingAddress = (address?: Address): string => {
    if (!address) return '-';
    const parts = [
        `${address.first_name} ${address.last_name}`,
        address.phone,
        address.street_address,
        address.street_address2,
        [address.city, address.county, address.postcode].filter(Boolean).join(', ')
    ].filter(Boolean);
    return parts.join(' • ');
};

export const getDayTotals = (orders: Order[], availableProducts?: Product[]) => {
    const products: Record<string, number> = {};
    const flavors: Record<string, number> = {};
    const randomBoxes: Record<string, number> = {};
    // Calculate day total by summing total_with_shipping from each order
    const dayTotal = orders.reduce((total, order) => total + order.checkout_session.total_with_shipping, 0);
    orders.forEach(order => {
        order.checkout_session?.cart?.items?.forEach(item => {
            const boxCustomization = item.box_customization;
            const quantity = item.quantity || 1;
            const productName = item.product?.name || 'Unknown Product';
            const chocolatesPerBox = item.product?.units_per_box || 0;
            const totalChocolates = chocolatesPerBox * quantity;
            // Product counting
            products[productName] = (products[productName] || 0) + quantity;
            if (boxCustomization?.selection_type === 'RANDOM') {
                // Handle random boxes with allergens
                if (boxCustomization.allergens && boxCustomization.allergens.length > 0) {
                    const allergenNames = boxCustomization.allergens
                        .map(allergen => allergen.name)
                        .sort()
                        .join(' and ');
                    const key = `Random (${allergenNames} Free)`;
                    randomBoxes[key] = (randomBoxes[key] || 0) + totalChocolates;
                } else {
                    // No allergens
                    randomBoxes['Random'] = (randomBoxes['Random'] || 0) + totalChocolates;
                }
            } else if (boxCustomization?.selection_type === 'PICK_AND_MIX') {
                // Flavor counting for pick & mix boxes
                const flavorSelections = [
                    ...(item.box_customization?.flavor_selections || []),
                    ...(item.pack_customization?.flavor_selections || [])
                ];
                flavorSelections.forEach(flavor => {
                    const flavorName = (flavor.flavor_name as string | undefined) || (flavor.flavor && (flavor.flavor.name as string | undefined));
                    if (flavorName && flavor.quantity) {
                        flavors[flavorName] = (flavors[flavorName] || 0) + (flavor.quantity * quantity);
                    }
                });
            }

            // Sum extras from pack customization
            const packCustomization = item.pack_customization;
            if (packCustomization) {
                // Function to lookup product name using availableProducts
                const getExtraName = (id: number, defaultName: string): string => {
                    if (availableProducts) {
                        const prod = availableProducts.find(p => p.id === id);
                        if (prod) return prod.name;
                    }
                    return defaultName;
                };

                if (packCustomization.hot_chocolate) {
                    const extraId = packCustomization.hot_chocolate;
                    const extraName = getExtraName(extraId, "Hot Chocolate");
                    products[extraName] = (products[extraName] || 0) + quantity;
                }
                if (packCustomization.chocolate_bark) {
                    const extraId = packCustomization.chocolate_bark;
                    const extraName = getExtraName(extraId, "Chocolate Bark");
                    products[extraName] = (products[extraName] || 0) + quantity;
                }
                if (packCustomization.gift_card) {
                    const extraId = packCustomization.gift_card;
                    const extraName = getExtraName(extraId, "Gift Card");
                    products[extraName] = (products[extraName] || 0) + quantity;
                }
            }
        });
    });
    return { products, flavors, randomBoxes, dayTotal };
}; 