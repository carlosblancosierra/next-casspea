import React from 'react'

interface Props {
  labels: string[]
  borders: string[]
  current: number
  onChange: (i: number) => void
}

export default function StepSidebar({ labels, borders, current, onChange }: Props) {
  return (
    <ul className="space-y-2">
      {labels.map((label, i) => (
        <li
          key={i}
          onClick={() => onChange(i)}
          className={`
            cursor-pointer px-3 py-2 border-l-4 rounded-r
            ${ current === i
              ? borders[i]
              : 'border-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          Step {i+1}: {label}
        </li>
      ))}
    </ul>
  )
}