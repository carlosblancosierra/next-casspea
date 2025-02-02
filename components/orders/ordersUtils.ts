import { Address } from '@/types/addresses';
import { Order } from '@/types/orders';

export const formatDate = (dateString?: string): { date: string; time: string } => {
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

export const formatCurrency = (amount?: string | number): string => {
  const num = typeof amount === 'number' ? amount : parseFloat(amount || '0');
  if (isNaN(num)) return '£0.00';
  return `£${num.toFixed(2)}`;
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

export const getDayTotals = (orders: Order[]) => {
  const products: Record<string, number> = {};
  const flavors: Record<string, number> = {};
  const randomBoxes: Record<string, number> = {};

  const dayTotal = orders.reduce((total, order) => {
    return total + order.checkout_session.total_with_shipping;
  }, 0);

  orders.forEach(order => {
    order.checkout_session?.cart?.items?.forEach(item => {
      const quantity = item.quantity || 1;
      const productName = item.product?.name || 'Unknown Product';
      const chocolatesPerBox = item.product?.units_per_box || 0;
      const totalChocolates = chocolatesPerBox * quantity;

      // Product counting
      products[productName] = (products[productName] || 0) + quantity;

      if (item.box_customization?.selection_type === 'RANDOM') {
        // Handle random boxes with allergens
        if (item.box_customization.allergens && item.box_customization.allergens.length > 0) {
          const allergenNames = item.box_customization.allergens
            .map(getAllergenName)
            .sort()
            .join(' and ');
          const key = `Random (${allergenNames} Free)`;
          randomBoxes[key] = (randomBoxes[key] || 0) + totalChocolates;
        } else {
          randomBoxes['Random'] = (randomBoxes['Random'] || 0) + totalChocolates;
        }
      } else if (item.box_customization?.selection_type === 'PICK_AND_MIX') {
        item.box_customization?.flavor_selections?.forEach(flavor => {
          if (flavor.flavor_name && flavor.quantity) {
            flavors[flavor.flavor_name] =
              (flavors[flavor.flavor_name] || 0) + (flavor.quantity * quantity);
          }
        });
      }
    });
  });

  return { products, flavors, randomBoxes, dayTotal };
}; 