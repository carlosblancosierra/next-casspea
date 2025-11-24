import React, { useState, useEffect } from 'react';
import { FlavourSelectionType } from '@/types/flavours';
import Image from 'next/image';

interface ProductConfirmProps {
  flavours: FlavourSelectionType[];
  isVisible: boolean;
  onClose: () => void;
  totalChocolates: number;
}

const ProductConfirm: React.FC<ProductConfirmProps> = ({ flavours, isVisible, onClose, totalChocolates }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setTimeout(() => setLoaded(true), 0);
    } else {
      setLoaded(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const getGridCols = (total: number) => {
    switch (total) {
      case 9:
        return 'grid-cols-3';
      case 15:
        return 'grid-cols-5';
      case 24:
        return 'grid-cols-6';
      case 48:
        return 'grid-cols-6';
      default:
        return 'grid-cols-3'; // default to 3 columns if total is unexpected
    }
  };

  const images = flavours.flatMap(({ flavour, quantity }, flavourIndex) =>
    Array.from({ length: quantity }).map((_, index) => (
      <div key={`${flavour.name}-${index}`} className={`opacity-0 mx-auto ${loaded ? 'fade-in' : ''}`}>
        {/* <img
          src={flavour.image}
          alt={flavour.name}
          className="w-full h-auto rounded-md mb-2"
        /> */}
        <Image src={flavour.image || '/flavours/default.png'}
          alt={flavour.name} width={0} height={0} sizes="100vw" className='w-20 h-22' />
        {/* <p className='text-xs dark:text-primary-text'>{flavour.name}</p> */}
      </div>
    ))
  );

  return (
    <div className="fixed inset-0 bg-gray-800 dark:bg-main-bg-dark bg-opacity-75 flex items-center justify-center md:max-h-[80vh] z-50">
      <div className="main-bg dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-lg text-center md:w-[50vw]">
        <h2 className="text-xl md:text-2xl font-bold mb-4 dark:text-primary-text">Creating your Unique Selection</h2>
        <div className={`grid gap-4 ${getGridCols(totalChocolates)}`}>
          {images}
        </div>
      </div>
    </div>
  );
};

export default ProductConfirm;
