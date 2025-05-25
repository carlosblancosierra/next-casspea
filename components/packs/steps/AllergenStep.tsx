import React from 'react'
import AllergenSelection from '@/components/product_detail/AllergenSelection'

interface Allergen { id: number; name: string }
interface Props {
  allergens: Allergen[]
  selectedAllergens: number[]
  setSelectedAllergens: (ids: number[]) => void
  allergenOption: 'NONE' | 'SPECIFY'
  setAllergenOption: (opt: 'NONE'|'SPECIFY') => void
  onNext: () => void
}

export default function AllergenStep({
  allergens, selectedAllergens, setSelectedAllergens,
  allergenOption, setAllergenOption, onNext
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 6: Select Allergens</h2>
      <p className="text-sm text-gray-500 mb-4">
        Sólo para bonbons (signature box).
      </p>
      <AllergenSelection
        allergens={allergens}
        selectedAllergens={selectedAllergens}
        setSelectedAllergens={setSelectedAllergens}
        allergenOption={allergenOption}
        setAllergenOption={setAllergenOption}
      />
      <button
        onClick={onNext}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
      >
        Next
      </button>
    </>
  )
}