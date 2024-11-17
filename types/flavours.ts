export interface FlavourType {
    name: string;
    slug: string;
    description: string;
    mini_description: string;
    allergens: {
        name: string;
        slug: string;
    }[];
    image: string;
    valentines_flavour?: boolean;
    updated?: string;
    timestamp?: string;
    active?: boolean;
}


export interface FlavourSelectionType {
    flavour: FlavourType;
    quantity: number;
}
