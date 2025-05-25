import React from 'react'
import { Product } from '@/types/products'
import { CartItemBoxFlavorSelection } from '@/types/carts'

interface Props {
  signatureBox: Product
  chocolateBark: Product | null
  hotChocolate: Product | null
  giftCard: Product | null
  flavours: CartItemBoxFlavorSelection[]
  allergenSummary: string
  price: number
  onEdit: (step: number) => void
  onConfirm: () => void
}

export default function SummaryStep({
  signatureBox, chocolateBark, hotChocolate, giftCard,
  flavours, allergenSummary, price, onEdit, onConfirm
}: Props) {
  const items = [
    { label: 'Signature Box',  name: signatureBox.name,  image: signatureBox.image, extra: `£${price}`, edit: 0 },
    { label: 'Chocolate Bark', name: chocolateBark?.name, image: chocolateBark?.image, edit: 1 },
    { label: 'Hot Chocolate',  name: hotChocolate?.name, image: hotChocolate?.image, edit: 2 },
    { label: 'Gift Card',      name: giftCard?.name || 'No Gift Card', image: giftCard?.image, edit: 3 },
    { label: 'Allergens',      name: allergenSummary, edit: 5 },
    { label: 'Flavours',       name: `${flavours.length} selected`, edit: 6 },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Step 8: Summary</h2>
      {items.map((it, i) => (
        <div
          key={i}
          onClick={() => onEdit(it.edit)}
          className="flex items-center space-x-4 p-2 border rounded hover:bg-gray-100 cursor-pointer"
        >
          {it.image && <img src={it.image} alt={it.name} className="w-16 h-16 object-cover rounded" />}
          <span className="font-medium">{it.label}: {it.name}</span>
          {it.extra && <span className="ml-auto font-semibold">{it.extra}</span>}
        </div>
      ))}
      <button
        onClick={onConfirm}
        className="mt-4 px-10 py-4 bg-pink-600 text-white rounded hover:bg-pink-500 float-right"
      >
        Add to Cart
      </button>
    </div>
  )
}