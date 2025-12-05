import React from 'react';
import { Flavour as FlavourType } from '@/types/flavours';
import Image from 'next/image';

interface FlavourCardProps {
    flavour: FlavourType;
    height?: string;
}

const FlavourCard: React.FC<FlavourCardProps> = ({ flavour, height = 'h-96' }) => {
    return (
        <div
            className={`border p-4 rounded-lg flex-shrink-0 bg-main-bg shadow-md dark:bg-main-bg-dark dark:text-primary-text dark:border-gray-700 w-full flex flex-col justify-between ${height}`}
            style={{ overflow: 'hidden', position: 'relative' }}
        >
            {/* Featured Badge */}
            {flavour.featured && flavour.featured_message && (
                <div
                    style={{
                        position: 'absolute',
                        top: 12,
                        right: -40,
                        transform: 'rotate(30deg)',
                        zIndex: 10,
                        width: 160,
                        textAlign: 'center',
                        pointerEvents: 'none',
                    }}
                    className="bg-pink-600 text-primary-text-light font-bold py-1 px-2 text-xs shadow-lg select-none"
                >
                    {flavour.featured_message}
                </div>
            )}
            <div className="w-full flex items-center justify-center" style={{ minHeight: 120, maxHeight: 120 }}>
                <Image
                    src={flavour.image || '/flavours/default.png'}
                    alt={flavour.name}
                    width={0}
                    height={0}
                    sizes="100vw"
                    className="object-contain w-full h-full max-h-[120px]"
                />
            </div>
            <h3 className="text-lg font-bold md:text-md text-center min-h-[2rem] mt-3 leading-5
            text-primary-text dark:text-primary-text-light">{flavour.name}</h3>
            <p className="text-primary-text dark:text-primary-text-light text-md min-h-[6.5rem] text-center overflow-hidden text-ellipsis">{flavour.description}</p>
            <p className="mt-1 text-[10px] text-secondary-text md:text-xs text-center">
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
