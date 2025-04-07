import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface Allergen {
    name: string;
    id: number;
}

interface AllergenSelectionProps {
    allergens: Allergen[];
    selectedAllergens: number[];
    setSelectedAllergens: (allergens: number[]) => void;
    allergenOption: 'NONE' | 'SPECIFY' | null;
    setAllergenOption: (option: 'NONE' | 'SPECIFY' | null) => void;
}

const AllergenSelection: React.FC<AllergenSelectionProps> = ({
    allergens,
    selectedAllergens,
    setSelectedAllergens,
    allergenOption,
    setAllergenOption
}) => {
    const handleAllergenChange = (allergerId: number) => {
        if (selectedAllergens.includes(allergerId)) {
            setSelectedAllergens(selectedAllergens.filter(id => id !== allergerId));
        } else {
            setSelectedAllergens([...selectedAllergens, allergerId]);
        }
    };

    return (
        <div className="rounded-lg shadow-sm">
            {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                2- Allergens
            </h3> */}
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">2. If you have any allergies, please select the allergens you are allergic to.</p>
            <RadioGroup value={allergenOption} onChange={setAllergenOption} className="space-y-3">
                <RadioGroup.Option
                    value="NONE"
                    className={({ checked }) =>
                        `${checked
                            ? 'bg-primary text-white'
                            : 'main-bg dark:bg-transparent text-gray-900 dark:text-gray-100'
                        }
                        relative rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-4 shadow-sm cursor-pointer flex focus:outline-none`
                    }
                >
                    {({ checked }) => (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <RadioGroup.Label as="p" className="font-medium">
                                        No Allergens
                                    </RadioGroup.Label>
                                    <RadioGroup.Description as="span" className={`inline ${checked ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                        I have no allergies.
                                    </RadioGroup.Description>
                                </div>
                            </div>
                            {checked && (
                                <div className="shrink-0 text-white">
                                    <CheckIcon className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                    )}
                </RadioGroup.Option>

                <RadioGroup.Option
                    value="SPECIFY"
                    className={({ checked }) =>
                        `${checked
                            ? 'bg-primary text-white'
                            : 'main-bg dark:bg-transparent text-gray-900 dark:text-gray-100'
                        }
                        relative rounded-lg border border-gray-300 dark:border-gray-600 px-5 py-4 shadow-sm cursor-pointer flex focus:outline-none`
                    }
                >
                    {({ checked }) => (
                        <div className="flex items-center justify-between w-full">
                            <div className="flex items-center">
                                <div className="text-sm">
                                    <RadioGroup.Label as="p" className="font-medium">
                                        Specify Allergens
                                    </RadioGroup.Label>
                                    <RadioGroup.Description as="span" className={`inline ${checked ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                                        Select one or more allergens you need to avoid.
                                    </RadioGroup.Description>
                                </div>
                            </div>
                            {checked && (
                                <div className="shrink-0 text-white">
                                    <CheckIcon className="h-6 w-6" />
                                </div>
                            )}
                        </div>
                    )}
                </RadioGroup.Option>
            </RadioGroup>

            {allergenOption === 'SPECIFY' && (
                <fieldset aria-label="Choose allergens" className="mt-4 grid grid-cols-2 gap-4 p-4">
                    {allergens.map((allergen) => (
                        <div key={allergen.id} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`allergen-${allergen.id}`}
                                name={`${allergen.id}-free`}
                                value={allergen.id}
                                className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary-2 dark:bg-gray-700 dark:border-gray-600"
                                checked={selectedAllergens.includes(allergen.id)}
                                onChange={() => handleAllergenChange(allergen.id)}
                            />
                            <label
                                htmlFor={`allergen-${allergen.id}`}
                                className="ml-2 block text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer"
                            >
                                {allergen.name} Free
                            </label>
                        </div>
                    ))}
                </fieldset>
            )}
        </div>
    );
};

export default AllergenSelection;
