import React from 'react';
import ConfirmCartItem from '@/components/cart/ConfirmCartItem';
import { CartItem as CartItemType } from '@/types/carts';

interface ConfirmCartItemTableProps {
  cartEntries: CartItemType[];
  shippingCost: number;
}

const ConfirmCartItemTable: React.FC<ConfirmCartItemTableProps> = ({ cartEntries, shippingCost }) => {
  const subtotal = cartEntries.reduce((acc, item) => acc + item.product.current_price * item.quantity, 0);
  const total = subtotal + shippingCost;

  return (
    <div className="space-y-6">
      {cartEntries.length > 0 ? (
        cartEntries.map((entry) => <ConfirmCartItem key={entry.id} entry={entry} />)
      ) : (
        <p className="text-primary-text text-center">Your cart is empty.</p>
      )}

      {/* Shipping and Total */}
      <div className="flex justify-end space-x-4 mt-4">
        <div className="text-right">
          <p className="text-primary-text">Subtotal: <span className="font-semibold">£{subtotal.toFixed(2)}</span></p>
          <p className="text-primary-text">Shipping: <span className="font-semibold">£{shippingCost.toFixed(2)}</span></p>
          <p className="text-lg font-bold text-primary-text">Total: <span className="font-semibold">£{total.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default ConfirmCartItemTable;
