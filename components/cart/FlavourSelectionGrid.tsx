import React from 'react';
import Image from 'next/image';
import { CartItemBoxFlavorSelection } from '@/types/carts';

interface FlavourSelectionGridProps {
  flavours: CartItemBoxFlavorSelection[];
  boxSize?: number;
}

const FlavourSelectionGrid: React.FC<FlavourSelectionGridProps> = ({ flavours, boxSize }) => {
  // Calculate the number of columns based on the box size
  const getColumnsCount = () => {
    switch (boxSize) {
      case 9:
        return 3;
      case 15:
        return 3;
      case 24:
        return 4;
      case 48:
        return 6;
      default:
        return 1; // Default to 1 column if the size is unknown
    }
  };

  // Determine the margin class (mx) based on the box size
  const getMarginClass = () => {
    switch (boxSize) {
      case 9:
        return 'mx-4';
      case 15:
        return 'mx-3';
      case 24:
        return 'mx-2';
      case 48:
        return 'mx-1';
      default:
        return 'mx-0'; // Default margin if the size is unknown
    }
  };

  return (
    <div
      className="flavours-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumnsCount()}, 1fr)`, // Dynamic number of columns
        gap: '10px', // Optional: spacing between items
      }}
    >
      {flavours.map((flavourSelection, index) => {
        // Loop through each flavour and render the quantity number of images
        const columns = Array(flavourSelection.quantity).fill(null);
        return columns.map((_, colIndex) => (
          <div key={`${flavourSelection.flavor.slug}-${index}-${colIndex}`} className={getMarginClass()}>
            {flavourSelection.flavor.image && (
              <Image
                src={flavourSelection.flavor.image}
                alt={flavourSelection.flavor.name}
                width={0}
                height={0}
                sizes="100vw"
                className="w-full h-auto"
              />
            )}
          </div>
        ));
      })}
    </div>
  );
};

export default FlavourSelectionGrid;
