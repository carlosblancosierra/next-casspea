import React from 'react'
import SelectableProductCard from '@/components/store/SelectableProductCard'
import { Product } from '@/types/products'

interface Props {
  products: Product[]
  onSelect: (p: Product) => void
}

export default function HotChocolateStep({ products, onSelect }: Props) {
  const items = products.filter(p => p.category?.slug === 'hot-chocolate')
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 3: Hot Chocolate</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p => (
          <SelectableProductCard
            key={p.id}
            product={p}
            price={0}
            onSelect={() => onSelect(p)}
          />
        ))}
      </div>
    </>
  )
}