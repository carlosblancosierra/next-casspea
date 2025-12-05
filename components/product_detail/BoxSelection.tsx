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
            {/* <h3 className="text-lg font-semibold text-primary-text dark:text-primary-text mb-4">
               1- Box Type Selection
            </h3> */}
    <p className="text-sm text-primary-text dark:text-primary-text-light mb-2">1. Choose your box type.</p>
        <RadioGroup value={selected} onChange={onChange} className={`space-y-4 ${className}`}>
            {options?.map((option) => (
                <RadioGroup.Option
                    key={option.value}
                    value={option.value}
                    className={({ checked }) => `
                        relative block cursor-pointer rounded-lg border px-6 py-4
                        ${checked
                            ? 'bg-primary border-primary text-white'
                            : 'main-bg dark:bg-transparent border-gray-300 dark:border-gray-600 text-primary-text dark:text-primary-text'
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
                                            className={checked ? 'text-white' : 'text-primary-text dark:text-primary-text'}
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
