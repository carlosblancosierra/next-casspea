import React from 'react';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/24/outline';

interface BoxOption {
    name: string;
    value: string;
    description: string;
}

interface BoxSelectionProps {
    options: BoxOption[];
    selected: string | null;
    onChange: (value: string) => void;
    className?: string;
}

const BoxSelection: React.FC<BoxSelectionProps> = ({ options, selected, onChange, className }) => {
    return (
        <>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
               1- Box Type Selection
            </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Please choose your box type.</p>
        <RadioGroup value={selected} onChange={onChange} className={`space-y-4 ${className}`}>
            {options?.map((option) => (
                <RadioGroup.Option
                    key={option.value}
                    value={option.value}
                    className={({ checked }) => `
                        relative block cursor-pointer rounded-lg border px-6 py-4
                        ${checked
                            ? 'bg-primary border-primary text-white'
                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100'
                        }
                        hover:border-primary transition-colors duration-200
                    `}
                >
                    {({ checked }) => (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className="font-medium"
                                        >
                                            {option.name}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                            as="span"
                                            className={checked ? 'text-white' : 'text-gray-500 dark:text-gray-400'}
                                        >
                                            {option.description}
                                        </RadioGroup.Description>
                                    </div>
                                </div>
                                {checked && (
                                    <div className="shrink-0 text-white">
                                        <CheckIcon className="h-6 w-6" />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </RadioGroup.Option>
            ))}
        </RadioGroup>
        </>
    );
};

export default BoxSelection;
