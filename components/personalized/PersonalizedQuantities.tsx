import React, { useEffect } from 'react';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import Spinner from '@/components/common/Spinner';

interface OrderDetails {
  quantity: number;
  selectedFlavours: number[];
}

interface PersonalizedQuantitiesProps {
  orderDetails: OrderDetails;
  setOrderDetails: React.Dispatch<React.SetStateAction<OrderDetails>>;
}

export default function PersonalizedQuantities({ orderDetails, setOrderDetails }: PersonalizedQuantitiesProps) {
  const { quantity, selectedFlavours } = orderDetails;
  const maxFlavours = Math.floor(quantity / 50);
  const { data: flavours, isLoading, error } = useGetFlavoursQuery();

  if (isLoading) return <Spinner md />;
  if (error) return <div>Error:</div>;

  const handleIncrement = () => {
    setOrderDetails((prev) => ({ ...prev, quantity: prev.quantity + 50 }));
  };

  const handleDecrement = () => {
    setOrderDetails((prev) => ({ ...prev, quantity: prev.quantity - 50 >= 50 ? prev.quantity - 50 : prev.quantity }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (!isNaN(newQuantity) && newQuantity >= 50) {
      setOrderDetails((prev) => ({ ...prev, quantity: newQuantity }));
    }
  };

  useEffect(() => {
    if (selectedFlavours.length > maxFlavours) {
      setOrderDetails((prev) => ({ ...prev, selectedFlavours: selectedFlavours.slice(0, maxFlavours) }));
    }
  }, [quantity, maxFlavours, selectedFlavours, setOrderDetails]);

  const handleFlavourToggle = (id: number) => {
    if (selectedFlavours.includes(id)) {
      setOrderDetails((prev) => ({ ...prev, selectedFlavours: selectedFlavours.filter(f => f !== id) }));
    } else if (selectedFlavours.length < maxFlavours) {
      setOrderDetails((prev) => ({ ...prev, selectedFlavours: [...selectedFlavours, id] }));
    }
  };

  return (
    <div className="p-4 space-y-6 bg-main-bg dark:bg-gray-800 rounded shadow">
      <div>
        <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Quantity
        </label>
        <div className="flex items-center mt-1 space-x-2">
          <button onClick={handleDecrement} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">-</button>
          <input
            id="quantity"
            type="number"
            value={quantity}
            onChange={handleInputChange}
            className="w-24 text-center rounded-md border border-gray-300 dark:border-gray-600 bg-main-bg dark:bg-gray-700 shadow-sm focus:outline-none focus:border-primary focus:ring-primary"
          />
          <button onClick={handleIncrement} className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded">+</button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Adjust quantity in steps of 50. (You can type any value ≥ 50.)
        </p>
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
          Select up to {maxFlavours} flavour{maxFlavours !== 1 ? 's' : ''}:
        </p>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {flavours?.map((flavour) => {
            const isChecked = selectedFlavours.includes(flavour.id);
            const disableCheckbox = !isChecked && selectedFlavours.length >= maxFlavours;
            return (
              <label key={flavour.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleFlavourToggle(flavour.id)}
                  disabled={disableCheckbox}
                  className="form-checkbox h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{flavour.name}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
