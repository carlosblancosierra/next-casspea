import React from 'react'
import Image from 'next/image'
import { LOVE_SLEEVE_PRICE } from '@/components/packs/constants'

interface Props {
  selected: boolean
  onSelect: (value: boolean) => void
  onNext: () => void
  image?: string | null
}

export default function LoveSleeveStep({ selected, onSelect, onNext, image }: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 5: Love Sleeve</h2>
      {image && (
        <div className="mb-4 w-40 h-40 relative rounded-lg overflow-hidden flex-shrink-0 bg-gray-100 dark:bg-gray-800">
          <Image
            src={image}
            alt="Love Sleeve"
            fill
            className="object-cover"
            sizes="160px"
          />
        </div>
      )}
      <p className="text-primary-text dark:text-primary-text-light mb-4">
        Add a Love Sleeve to wrap your pack for £{LOVE_SLEEVE_PRICE.toFixed(2)}. Optional.
      </p>
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          onClick={() => onSelect(true)}
          className={`flex-1 px-6 py-4 rounded-lg border-2 font-medium transition-colors ${
            selected === true
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 text-primary-text dark:text-primary-text-light'
          }`}
        >
          Yes, add Love Sleeve (£{LOVE_SLEEVE_PRICE.toFixed(2)})
        </button>
        <button
          type="button"
          onClick={() => onSelect(false)}
          className={`flex-1 px-6 py-4 rounded-lg border-2 font-medium transition-colors ${
            selected === false
              ? 'border-primary bg-primary/10 text-primary'
              : 'border-gray-300 dark:border-gray-600 hover:border-primary/50 text-primary-text dark:text-primary-text-light'
          }`}
        >
          No thanks
        </button>
      </div>
      <button
        onClick={onNext}
        className="px-6 py-2 bg-primary text-primary-text-light rounded-md hover:bg-primary/90"
      >
        Next
      </button>
    </>
  )
}
