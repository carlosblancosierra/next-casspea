"use client";

import React, { useState } from 'react';
import { FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import { CartItem as CartItemType } from '@/types/carts';
import FlavourSelectionGrid from './FlavourSelectionGrid';
import { useChangeCartItemQuantityMutation, useRemoveCartItemMutation } from '@/redux/features/carts/cartApiSlice';
import { useGetProductQuery, useGetProductsQuery } from '@/redux/features/products/productApiSlice';
import { skipToken } from '@reduxjs/toolkit/query';
import { toast } from 'react-toastify';
import { Allergen } from '@/types/allergens';

interface CartItemProps {
  entry: CartItemType;
}

const CartItem: React.FC<CartItemProps> = ({ entry }) => {
  const boxSize = entry.product.units_per_box;
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [showFlavours, setShowFlavours] = useState(false);
  const [changeQuantity, { isLoading: isChangingQuantity }] = useChangeCartItemQuantityMutation();
  const [removeItem, { isLoading: isRemoving }] = useRemoveCartItemMutation();
  const isLoading = isChangingQuantity || isRemoving;
  const { data, isLoading: isLoadingProducts, error } = useGetProductsQuery();
  const products = data ?? [];
  const hotChocolate = products.find(p => p.id === entry.pack_customization?.hot_chocolate);
  const giftCard = products.find(p => p.id === entry.pack_customization?.gift_card);
  const bark = products.find(p => p.id === entry.pack_customization?.chocolate_bark);

  const customization = entry.pack_customization ?? entry.box_customization;

  const handleQuantityChange = async (change: number) => {
    const newQuantity = entry.quantity + change;
    if (newQuantity < 1) return;
    try {
      await changeQuantity({ id: entry.id, quantity: newQuantity }).unwrap();
    } catch (error) {
      toast.error('Failed to update quantity');
      console.error(error);
    }
  };

  const handleRemove = async () => {
    try {
      await removeItem(entry.id).unwrap();
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
      console.error(error);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-[1fr,3fr] gap-x-4 gap-y-1 border bg-main-bg p-4 rounded-lg shadow-sm dark:bg-main-bg-dark md:p-6">
        {/* Imagen */}
        <a href="#" className="col-span-1">
          <img
            className="w-full max-w-[150px]"
            src={entry.product.image || 'https://via.placeholder.com/150'}
            alt={entry.product.name}
          />
        </a>

        {/* Info, acciones y selección */}
        <div className="col-span-1 space-y-4">
          <a href="#" className="text-base font-medium hover:underline text-primary-text dark:text-primary-text-light">
            {entry.product.name}
          </a>

          {customization && customization.selection_type && (
            <p className="flex flex-wrap items-center gap-2">
              <span className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light ring-1 ring-inset ring-gray-500/10">
                {customization.selection_type === 'PICK_AND_MIX' ? 'Pick & Mix' : null}
                {customization.selection_type === 'RANDOM' ? 'Surprise Me' : null}
              </span>
              {'allergens' in customization && customization.allergens
                ? customization.allergens.map((a: Allergen) => (
                    <span
                      key={a.id}
                      className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light ring-1 ring-inset ring-gray-500/10"
                    >
                      {a.name} Free
                    </span>
                  ))
                : null}
            </p>
          )}

          <p className="text-base font-bold text-primary-text dark:text-primary-text-light">£{entry.product.current_price}</p>

          {/* Controles de cantidad y borrado */}
          <div className="flex items-center space-x-2">
            <button onClick={() => setIsDeleteModalOpen(true)} disabled={isLoading} aria-label="Remove item">
              <FiTrash2 className="w-4 h-4 text-red-600" />
            </button>

            <button
              onClick={() => handleQuantityChange(-1)}
              disabled={isLoading || entry.quantity <= 1}
              className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              aria-label="Decrease quantity"
            >
              <FiMinus className="w-4 h-4 text-primary-text dark:text-primary-text-light" />
            </button>

            <span className="px-2 py-1 min-w-[40px] text-center font-medium text-primary-text dark:text-primary-text-light">
              {entry.quantity}
            </span>

            <button
              onClick={() => handleQuantityChange(1)}
              disabled={isLoading}
              className="p-1.5 rounded-md border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600 dark:hover:bg-gray-700 transition-colors"
              aria-label="Increase quantity"
            >
              <FiPlus className="w-4 h-4 text-primary-text dark:text-primary-text-light" />
            </button>
          </div>

          <div className='hidden md:block'>
            {/* Productos extra del pack */}
            {entry.pack_customization && (
              <p className="flex flex-col gap-4 mt-4">
                {hotChocolate && (
                  <div>
                    <p className="text-xs text-primary-text dark:text-primary-text-light italic">Hot Chocolate</p>
                    <span className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light">
                    {hotChocolate.name}
                    </span>
                  </div>
                )}
                {giftCard && (
                  <div>
                    <p className="text-xs text-primary-text dark:text-primary-text-light italic">Gift Card</p>
                    <span className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light">
                      {giftCard.name}
                    </span>
                  </div>
                )}
                {bark && (
                  <div>
                    <p className="text-xs text-primary-text dark:text-primary-text-light italic">Chocolate Bark</p>
                    <span className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light">
                      {bark.name}
                    </span>
                  </div>
                )}
              </p>
            )}
          </div>

          
          <div>
            {/* Flavours: desktop (en columna derecha) */}
            {customization?.selection_type === 'PICK_AND_MIX' && (
                <div className="hidden md:block md:col-start-2">
                  <button
                    onClick={() => setShowFlavours(prev => !prev)}
                    className="px-4 py-2 text-primary-text dark:text-primary-text-light rounded-md text-sm border border-text-primary-text dark:text-primary-text-light"
                  >
                    {showFlavours ? 'Hide flavours' : 'Show flavours'}
                  </button>
                  {showFlavours && (
                    <div className="mt-2">
                      <FlavourSelectionGrid flavours={customization.flavor_selections || []} boxSize={boxSize} />
                    </div>
                  )}
                </div>
              )}
          </div>

        </div>

        <div className="col-span-2 mb-4 md:hidden">
          {/* Productos extra del pack */}
          {entry.pack_customization && (
            <p className="flex flex-col gap-4 mt-4">
              {hotChocolate && (
                <div>
                  <p className="text-xs text-primary-text dark:text-primary-text-light italic">Hot Chocolate</p>
                  <span className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light">
                   {hotChocolate.name}
                  </span>
                </div>
              )}
              {giftCard && (
                <div>
                  <p className="text-xs text-primary-text dark:text-primary-text-light italic">Gift Card</p>
                  <span className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light">
                    {giftCard.name}
                  </span>
                </div>
              )}
              {bark && (
                <div>
                  <p className="text-xs text-primary-text dark:text-primary-text-light italic">Chocolate Bark</p>
                  <span className="rounded-md px-2 py-1 text-xs font-medium text-primary-text dark:text-primary-text-light">
                    {bark.name}
                  </span>
                </div>
              )}
            </p>
          )}
        </div>

        {/* Flavours: móvil (bajo ambas columnas) */}
        {customization?.selection_type === 'PICK_AND_MIX' && (
          <div className="col-span-2 md:hidden flex flex-col">
            <div className="flex justify-end">
              <button
                onClick={() => setShowFlavours(prev => !prev)}
                className="px-4 py-2 text-primary-text dark:text-primary-text-light rounded-md text-sm border border-text-primary-text dark:text-primary-text-light"
              >
                {showFlavours ? 'Hide flavours' : 'Show flavours'}
              </button>
            </div>
            {showFlavours && (
              <div className="mt-2">
                <FlavourSelectionGrid flavours={customization.flavor_selections || []} boxSize={boxSize} />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmación de borrado */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-main-bg rounded-lg shadow dark:bg-main-bg-dark max-w-md w-full">
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-600">
              <h3 className="text-xl text-primary-text dark:text-primary-text-light">Remove Item</h3>
              <button onClick={() => setIsDeleteModalOpen(false)} className="text-primary-text dark:text-primary-text-light">
                <span className="sr-only">Close modal</span>×
              </button>
            </div>
            <div className="p-4 text-primary-text dark:text-primary-text-light">
              Are you sure you want to remove {entry.product.name}?
            </div>
            <div className="flex justify-end p-4 border-t dark:border-gray-600">
              <button
                onClick={() => {
                  handleRemove();
                  setIsDeleteModalOpen(false);
                }}
                className="px-5 py-2.5 text-sm font-medium text-primary-text dark:text-primary-text-light bg-red-600 rounded-lg"
              >
                Yes, remove
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 ml-2 text-sm font-medium border rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItem;