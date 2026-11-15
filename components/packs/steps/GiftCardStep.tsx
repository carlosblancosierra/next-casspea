import React from 'react'
import SelectableGiftCard from '@/components/store/SelectableGiftCard'
import GiftMessage from '@/components/cart/GiftMessage'
import { Product } from '@/types/products'
import { buttonClasses } from '@/components/common/Button';

interface Props {
  products: Product[]
  selected?: Product | null
  onSelect: (p: Product | null) => void
  giftMessage: string
  onMessageChange: (msg: string) => void
  onNext: () => void
}

export default function GiftCardStep({
  products, selected, onSelect, giftMessage, onMessageChange, onNext
}: Props) {
  const items = products.filter(p => p.category?.slug === 'gift-cards')
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 4: Gift Card</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {items.map(p => (
          <SelectableGiftCard
            key={p.id}
            title={p.name}
            image={p.image || ''}
            selected={selected?.id === p.id}
            onSelect={() => onSelect(p)}
          />
        ))}
        <div
          onClick={() => onSelect(null)}
          className={`flex items-center justify-center p-6 border rounded cursor-pointer
            ${selected === null ? 'border-blue-500' : 'border-gray-300'}`}
        >
          No Gift Card
        </div>
      </div>
      {selected && (
        <div className="mt-4">
          <GiftMessage onGiftMessageChange={onMessageChange} />
        </div>
      )}
      <button
        onClick={onNext}
        className={buttonClasses({ className: 'mt-6' })}
      >
        Next
      </button>
    </>
  )
}