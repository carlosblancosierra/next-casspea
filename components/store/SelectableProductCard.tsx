import React from 'react'
import { Product } from '@/types/products'
import Image from 'next/image'

interface Props {
  product: Product
  onSelect: () => void
  price?: number
  isDisabled?: boolean
  soldOutLabel?: string
}

export default function SelectableProductCard({
  product,
  onSelect,
  price,
  isDisabled = false,
  soldOutLabel = 'Sold out'
}: Props) {
  // Use product.image or default image
  const displayImage = product.image || '/images/default-product.png'
  
  return (
    <div
      onClick={isDisabled ? undefined : onSelect}
      className={`block group relative shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark transition-opacity ${
        isDisabled ? 'opacity-60 cursor-not-allowed hover:opacity-60' : 'hover:opacity-90 cursor-pointer'
      }`}
    >
      {isDisabled && (
        <div className="absolute top-2 right-2 z-10 text-[10px] font-semibold bg-gray-900/70 text-white rounded px-2 py-1">
          {soldOutLabel}
        </div>
      )}
      <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-main-bg-dark lg:aspect-none group-hover:opacity-75 lg:h-80">
        <Image
          alt={product.name}
          src={displayImage}
          width={0}
          height={0}
          sizes="100vw"
          className="h-full w-full object-cover object-center lg:h-full lg:w-full"
        />
      </div>
      {price === 0 ? (
        <>
          <p className="text-md font-medium text-primary-text dark:text-primary-text-light mt-4">{product.name}</p>
          <p className="mt-1 text-sm text-primary-text dark:text-primary-text-light">Included in your pack</p>
          <p className="mt-1 text-sm text-primary-text dark:text-primary-text-light">{product.weight} g</p>
        </>
      ) : (
        <>
          <p className="text-md font-medium text-primary-text dark:text-primary-text-light mt-4">￡ {price !== undefined ? price : product.base_price}</p>
          <div className="flex justify-between mt-1">
            <div>
              <h3 className="text-xs md:text-sm text-primary-text dark:text-primary-text-light h-12">{product.name}</h3>
              <p className="mt-1 text-sm text-primary-text dark:text-primary-text-light">{product.weight} g</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}