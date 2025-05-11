import React from 'react'
import { Product } from '@/types/products'
import Image from 'next/image'

interface Props {
  product: Product
  onSelect: () => void
}

export default function SelectableProductCard({ product, onSelect }: Props) {
  return (
    <div
      onClick={onSelect}
      className="cursor-pointer border rounded-lg p-2 hover:shadow-lg transition"
    >
      {product.image && (
        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 dark:bg-gray-700 lg:aspect-none group-hover:opacity-75 lg:h-80">
          <Image
            alt={product.name}
            src={product.image}
            width={0}
            height={0}
            sizes="100vw"
            className="h-full w-full object-cover object-center lg:h-full lg:w-full"
          />
        </div>
      )}
      <h3 className="mt-2 text-center font-medium">{product.name}</h3>
    </div>
  )
}