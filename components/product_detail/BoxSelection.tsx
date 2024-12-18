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
        <RadioGroup value={selected} onChange={onChange} className={`space-y-4 ${className}`}>
            {options?.map((option) => (
                <RadioGroup.Option
                    key={option.value}
                    value={option.value}
                    className={({ checked, active }) => `
                        relative block cursor-pointer rounded-lg border px-6 py-4
                        ${checked ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-300 dark:border-gray-600'}
                        ${active ? 'ring-2 ring-indigo-600' : ''}
                        hover:border-indigo-600
                    `}
                >
                    {({ checked }) => (
                        <>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="text-sm">
                                        <RadioGroup.Label
                                            as="p"
                                            className={`font-medium ${checked ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-gray-100'
                                                }`}
                                        >
                                            {option.name}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description as="span" className="text-gray-500 dark:text-gray-400">
                                            {option.description}
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
            ))}
        </RadioGroup>
    );
};

export default BoxSelection;
