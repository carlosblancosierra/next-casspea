import React from 'react'

interface Option { name: string; value: string; description: string }
interface Props {
  options: Option[]
  selected: string
  onChange: (v: string) => void
  onNext: () => void
}

export default function BoxTypeStep({ options, selected, onChange, onNext }: Props) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Step 5: Choose Box Type</h2>
      <div className="space-y-2">
        {options.map(o => (
          <div key={o.value} className="flex items-center">
            <input
              type="radio"
              id={o.value}
              name="boxType"
              checked={selected === o.value}
              onChange={() => onChange(o.value)}
            />
            <label htmlFor={o.value} className="ml-2">
              <span className="font-medium">{o.name}</span> — {o.description}
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={onNext}
        disabled={!selected}
        className={`mt-4 px-6 py-2 rounded text-white ${
          selected ? 'bg-primary hover:bg-primary/80' : 'bg-main-bg cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </>
  )
}