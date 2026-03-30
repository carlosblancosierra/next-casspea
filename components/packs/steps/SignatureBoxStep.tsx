import React from 'react'
import SelectableProductCard from '@/components/store/SelectableProductCard'
import { Product } from '@/types/products'
import { ID_MAP, STEP_EXPLANATIONS } from '@/components/packs/constants'
interface Props {
  products: Product[]
  priceMap: Record<number,number>
  onSelect: (p: Product) => void
}

export default function SignatureBoxStep({ products, priceMap, onSelect }: Props) {
  const items = products.filter(
    p => p.category?.slug === 'signature-boxes' && p.units_per_box !== 96
  )

  const anyIndulgenceSoldOut = items.some(p => {
    const packProductId = ID_MAP[p.units_per_box ?? 0]
    if (!packProductId) return false
    const packProduct = products.find(pr => pr.id === packProductId)
    return Boolean(packProduct?.sold_out)
  })
  return (
    <>
        <section className="mb-8">
          <h2 className="font-bold mt-2">
            Welcome to CassPea Indulgent Chocolate Packs
          </h2>

          <p className="text-sm text-primary-text dark:text-primary-text-light mt-2">Your pack begins with a signature box, followed by a chocolate bark, a cup of hot chocolate, and a gift card. We'll guide you through each step to create your unique bespoke pack.</p>
        </section>

        {anyIndulgenceSoldOut && (
          <p className="text-sm text-primary-text dark:text-primary-text-light mb-4">
            Some indulgence pack sizes are currently sold out, so they can not be added to cart.
          </p>
        )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(p => {
          const packProductId = ID_MAP[p.units_per_box ?? 0]
          const packProduct = packProductId ? products.find(pr => pr.id === packProductId) : undefined
          const soldOut = Boolean(packProduct?.sold_out)

          return (
            <SelectableProductCard
              key={p.id}
              product={p}
              price={priceMap[p.units_per_box ?? 0]}
              onSelect={() => onSelect(p)}
              isDisabled={soldOut}
              soldOutLabel="Sold out"
            />
          )
        })}
      </div>
      <p className="text-sm text-primary-text dark:text-primary-text-light mt-2">
        Your box size determines the price of your pack.
      </p>
    </>
  )
}