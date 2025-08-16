import React from 'react';
import { Flavour as FlavourType } from '@/types/flavours';
import Image from 'next/image';

interface FlavourCardProps {
    flavour: FlavourType;
}

const FlavourCard: React.FC<FlavourCardProps> = ({ flavour }) => {
    return (
        <div
            className="border p-4 rounded-lg flex-shrink-0 bg-main-bg shadow-md dark:bg-gray-800 dark:text-white dark:border-gray-700"
            style={{ overflow: 'hidden' }}
        >
            <div className="mx-20">
                <Image src={flavour.image || '/flavours/default.png'}
                    alt={flavour.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className='w-full h-auto' />
            </div>
            <h3 className="text-lg font-bold md:text-md text-center min-h-[2rem] mt-3 leading-5
            ">{flavour.name}</h3>
            <p className="text-md min-h-[6.5rem] text-center overflow-hidden text-ellipsis">{flavour.description}</p>
            <p className="mt-1 text-[10px] text-gray-500 md:text-xs text-center">
                {flavour.allergens?.map((allergen, index) => (
                    <span key={index} className="mr-1">
                        {allergen.name},
                    </span>
                ))}
            </p>
        </div>
    );
};

export default FlavourCard;
