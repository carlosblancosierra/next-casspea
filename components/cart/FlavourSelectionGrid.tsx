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
        return 5;
      case 15:
        return 5;
      case 24:
        return 6;
      case 48:
        return 8;
      default:
        return 5;
    }
  };

  const getGridGap = () => {
    switch (boxSize) {
      case 9:
        return '10px';
      case 15:
        return '10px';
      case 24:
        return '5px';
      case 48:
        return '3px';
      default:
        return '10px';
    }
  };

  return (
    <div
      className="flavours-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumnsCount()}, 1fr)`, // Dynamic number of columns
        gap: getGridGap()
      }}
    >
      {flavours.map((flavourSelection, index) => {
        // Loop through each flavour and render the quantity number of images
        const columns = Array(flavourSelection.quantity).fill(null);
        return columns.map((_, colIndex) => (
          <div key={`${flavourSelection.flavor}-${index}-${colIndex}`}>
            {flavourSelection.flavor && (
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
