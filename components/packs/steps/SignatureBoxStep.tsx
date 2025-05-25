import React from 'react'
import SelectableProductCard from '@/components/store/SelectableProductCard'
import { Product } from '@/types/products'

interface Props {
  products: Product[]
  priceMap: Record<number,number>
  onSelect: (p: Product) => void
}

export default function SignatureBoxStep({ products, priceMap, onSelect }: Props) {
  const items = products.filter(p => p.category?.slug === 'signature-boxes')
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 1: Signature Box</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p => (
          <SelectableProductCard
            key={p.id}
            product={p}
            price={priceMap[p.units_per_box]}
            onSelect={() => onSelect(p)}
          />
        ))}
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Tu tamaño determina el precio.
      </p>
    </>
  )
}