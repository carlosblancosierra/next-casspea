import React from 'react'
import Image from 'next/image'

interface Props {
  title: string
  image: string
  selected?: boolean
  onSelect: () => void
}

export default function SelectableGiftCard({
  title,
  image,
  selected = false,
  onSelect,
}: Props) {
  return (
    <div
      onClick={onSelect}
      className={[
        'relative cursor-pointer rounded-lg p-0 transition flex flex-col items-center',
        selected
          ? 'border-2 border-blue-500 shadow-lg'
          : 'border border-gray-300 hover:shadow-md',
      ].join(' ')}
    >
      {/* check icon */}
      {selected && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 z-20">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      <div className="w-full aspect-video relative">
        <Image
          src={image}
          alt={title}
          fill
          sizes="100vw"
          className="object-cover rounded"
        />
      </div>
      <p className="text-md font-medium text-gray-900 dark:text-white my-2">{title}</p>
      <h3 className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-2">￡ 2.00 GBP</h3>
    </div>
  )
}