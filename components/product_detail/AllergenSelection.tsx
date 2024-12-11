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
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                Allergens
            </h3>
            <RadioGroup value={allergenOption} onChange={setAllergenOption} className="space-y-3">
                <RadioGroup.Option
                    value="NONE"
                    className={({ active, checked }) =>
                        `${checked
                            ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-600'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        }
                        relative rounded-lg border px-5 py-4 shadow-sm cursor-pointer flex focus:outline-none`
                    }
                >
                    {({ checked }) => (
                        <>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className={`font-medium ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'
                                                }`}
                                        >
                                            No Allergens
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                            as="span"
                                            className={`inline ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            I have no allergies.
                                        </RadioGroup.Description>
                                    </div>
                                </div>
                                {checked && (
                                    <div className="shrink-0 text-indigo-600 dark:text-indigo-400">
                                        <CheckIcon className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </RadioGroup.Option>

                <RadioGroup.Option
                    value="SPECIFY"
                    className={({ active, checked }) =>
                        `${checked
                            ? 'bg-indigo-50 dark:bg-indigo-900 border-indigo-600'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
                        }
                        relative rounded-lg border px-5 py-4 shadow-sm cursor-pointer flex focus:outline-none`
                    }
                >
                    {({ checked }) => (
                        <>
                            <div className="flex items-center justify-between w-full">
                                <div className="flex items-center">
                                    <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className={`font-medium ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'
                                                }`}
                                        >
                                            Specify Allergens
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                            as="span"
                                            className={`inline ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
                                                }`}
                                        >
                                            Select one or more allergens you need to avoid.
                                        </RadioGroup.Description>
                                    </div>
                                </div>
                                {checked && (
                                    <div className="shrink-0 text-indigo-600 dark:text-indigo-400">
                                        <CheckIcon className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        </>
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
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
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
