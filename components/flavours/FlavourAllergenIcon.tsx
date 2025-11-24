import React from 'react';
import { GiChocolateBar, GiPeanut, GiWheat, GiSoybean } from "react-icons/gi";
import { FaBreadSlice } from "react-icons/fa";

interface FlavourAllergenIconProps {
    allergenSlug: string;
    width?: number;
    className?: string; // To add custom styles to the icon
}

// Allergen data with associated icons
const allergens = [
    { name: 'Milk Solids', slug: 'milk', icon: GiChocolateBar },
    { name: 'Nuts', slug: 'nuts', icon: GiPeanut },
    { name: 'Soy', slug: 'soy', icon: GiSoybean },
    { name: 'Wheat', slug: 'wheat', icon: FaBreadSlice },
    { name: 'Gluten', slug: 'gluten', icon: GiWheat },
];

const FlavourAllergenIcon: React.FC<FlavourAllergenIconProps> = ({ allergenSlug, width = 24, className = '' }) => {
    const allergen = allergens.find(a => a.slug === allergenSlug);

    if (!allergen) return null;

    const IconComponent = allergen.icon;

    return (
        <div className="relative group">
            <IconComponent className={`text-primary-text hover:text-primary-text ${className}`} size={width} />
            <div className="absolute z-10 hidden group-hover:block bg-gray-900 text-white text-sm rounded-lg px-2 py-1 mt-1">
                {allergen.name}
                <div className="tooltip-arrow" data-popper-arrow></div>
            </div>
        </div>
    );
};

export default FlavourAllergenIcon;
