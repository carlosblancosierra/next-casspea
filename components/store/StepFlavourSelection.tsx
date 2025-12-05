import React from 'react'
import Image from 'next/image'
import { Flavour as FlavourType } from '@/types/flavours'
import { CartItemBoxFlavorSelection } from '@/types/carts'
import { FiPlus, FiMinus, FiTrash } from 'react-icons/fi'

interface Props {
  available: FlavourType[]
  selectedAllergens: number[]
  flavours: CartItemBoxFlavorSelection[]
  remaining: number
  max: number
  onAdd: (f: FlavourType) => void
  onIncrement: (idx: number) => void
  onDecrement: (idx: number) => void
  onDelete: (idx: number) => void
  onClear: () => void
  onNext: () => void
}

export default function StepFlavourSelection({
  available,
  selectedAllergens,
  flavours,
  remaining,
  max,
  onAdd,
  onIncrement,
  onDecrement,
  onDelete,
  onClear,
  onNext
}: Props) {
  const filtered = selectedAllergens.length === 0
    ? available
    : available.filter(f =>
        !(f.allergens || []).some(a => selectedAllergens.includes(a.id))
      )

  const getQty = (id: number) =>
    flavours.find(x => x.flavor.id === id)?.quantity || 0

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-primary-text dark:text-primary-text-light">Step 6: Choose Flavours</h2>
      <p className="text-primary-text dark:text-primary-text-light">
        Select up to {max} chocolates ({max - remaining} chosen, {remaining} left).
      </p>

      {flavours.length > 0 && (
        <div className="space-y-2">
          {flavours.map((f, i) => (
            <div key={f.flavor.id} className="flex items-center p-2 border rounded">
              <Image
                src={f.flavor.image || '/flavours/default.png'}
                alt={f.flavor.name}
                width={48}
                height={48}
                className="rounded"
              />
              <span className="ml-3 flex-1 font-medium text-primary-text dark:text-primary-text-light">{f.flavor.name}</span>
              <div className="flex items-center space-x-1">
                <button onClick={() => onDecrement(i)}><FiMinus /></button>
                <span>{f.quantity}</span>
                <button onClick={() => onIncrement(i)} disabled={remaining === 0}><FiPlus /></button>
                <button onClick={() => onDelete(i)}><FiTrash /></button>
              </div>
            </div>
          ))}
          <button
            onClick={onClear}
            className="text-sm text-primary-text dark:text-primary-text-light hover:underline"
          >
            Clear all
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map(f => (
          <div
            key={f.id}
            className="border rounded-lg p-4 flex flex-col items-center hover:shadow-lg"
          >
            <div className="w-24 h-24 relative">
              <Image
                src={f.image || '/flavours/default.png'}
                alt={f.name}
                fill
                className="object-contain rounded"
              />
            </div>
            <h3 className="mt-2 font-medium text-center text-primary-text dark:text-primary-text-light">{f.name}</h3>
            <button
              onClick={() => onAdd(f)}
              disabled={remaining === 0}
              className={`mt-3 px-4 py-2 rounded ${
                remaining > 0
                  ? 'bg-primary text-primary-text-light'
                  : 'bg-main-bg text-primary-text dark:text-primary-text-light cursor-not-allowed'
              }`}
            >
              + Add
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={onNext}
        disabled={remaining > 0}
        className="mt-6 w-full py-3 bg-blue-600 text-primary-text-light rounded disabled:opacity-50"
      >
        Next: Order Summary
      </button>
    </div>
  )
}