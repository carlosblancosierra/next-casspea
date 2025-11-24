import React from 'react'
import FlavourPicker from '@/components/product_detail/FlavourPicker'
import { Product } from '@/types/products'
import { CartItemBoxFlavorSelection } from '@/types/carts'
import { Flavour as FlavourType } from '@/types/flavours';

interface Props {
  signatureBox: Product
  flavours: CartItemBoxFlavorSelection[]
  remaining: number
  handleAddFlavour: (f: FlavourType) => void
  incrementQuantity: (i: number) => void
  decrementQuantity: (i: number) => void
  deleteFlavour: (i: number) => void
  handleClear: () => void
  selectedAllergens: number[]
  onNext: () => void
  allFlavours?: FlavourType[]
}

export default function FlavourStep({
  signatureBox, flavours, remaining,
  handleAddFlavour, incrementQuantity, decrementQuantity,
  deleteFlavour, handleClear, selectedAllergens, onNext, allFlavours
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 7: Choose Flavours</h2>
      <FlavourPicker
        flavours={flavours}
        remainingChocolates={remaining}
        maxChocolates={signatureBox.units_per_box ?? 0}
        handleAddFlavour={handleAddFlavour}
        incrementQuantity={incrementQuantity}
        decrementQuantity={decrementQuantity}
        deleteFlavour={deleteFlavour}
        handleDeleteAllFlavours={handleClear}
        selectedAllergens={selectedAllergens}
        handleFlavourChange={() => {}}
        availableFlavours={allFlavours}
      />
      <button
        onClick={onNext}
        disabled={remaining > 0}
        className={`mt-4 px-6 py-2 rounded text-white ${
          remaining > 0 ? 'bg-main-bg cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500'
        }`}
      >
        Next
      </button>
    </>
  )
}