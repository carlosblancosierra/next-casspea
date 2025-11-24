import React from 'react'
import { Product } from '@/types/products'
import Image from 'next/image'

interface Props {
  product: Product
  onSelect: () => void
  price?: number
}

export default function SelectableProductCard({ product, onSelect, price }: Props) {
  // Use product.image or default image
  const displayImage = product.image || '/images/default-product.png'
  
  return (
    <div
      onClick={onSelect}
      className="block group relative shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-main-bg-dark hover:opacity-90 transition-opacity cursor-pointer"
    >
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
          <p className="text-md font-medium text-primary-text mt-4">{product.name}</p>
          <p className="mt-1 text-sm text-primary-text">Included in your pack</p>
          <p className="mt-1 text-sm text-primary-text">{product.weight} g</p>
        </>
      ) : (
        <>
          <p className="text-md font-medium text-primary-text mt-4">￡ {price !== undefined ? price : product.base_price}</p>
          <div className="flex justify-between mt-1">
            <div>
              <h3 className="text-xs md:text-sm text-primary-text h-12">{product.name}</h3>
              <p className="mt-1 text-sm text-primary-text">{product.weight} g</p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}