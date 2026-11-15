import React from 'react'
import AllergenSelection from '@/components/product_detail/AllergenSelection'
import { buttonClasses } from '@/components/common/Button';

interface Allergen { id: number; name: string }
interface Props {
  allergens: Allergen[]
  selectedAllergens: number[]
  setSelectedAllergens: (ids: number[]) => void
  allergenOption: 'NONE' | 'SPECIFY' | null
  setAllergenOption: (opt: 'NONE' | 'SPECIFY' | null) => void
  onNext: () => void
}

export default function AllergenStep({
  allergens, selectedAllergens, setSelectedAllergens,
  allergenOption, setAllergenOption, onNext
}: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 6: Select Allergens</h2>
      <p className="text-sm text-primary-text dark:text-primary-text-light mb-4">
        Only for bonbons of the signature box.
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
        className={buttonClasses({ className: 'mt-4' })}
      >
        Next
      </button>
    </>
  )
}