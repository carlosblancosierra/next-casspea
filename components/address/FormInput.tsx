import React from 'react';
import clsx from 'clsx';

interface FormInputProps {
    id: string;
    name: string;
    label: string;
    value: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    pattern?: string;
    readOnly?: boolean;
    placeholder?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    id,
    name,
    label,
    value,
    onChange,
    type = 'text',
    required = false,
    pattern,
    readOnly = false,
    placeholder,
}) => (
    <div className="space-y-1">
        <label htmlFor={id} className="block text-xs font-medium text-gray-700 dark:text-gray-200">
            {label} {required && '*'}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            pattern={pattern}
            readOnly={readOnly}
            placeholder={placeholder}
            className={clsx(
                "mt-0.5 block w-full rounded-md border text-base",
                readOnly ? " dark:bg-gray-700" : "main-bg dark:bg-gray-800",
                "text-gray-900 dark:text-gray-100",
                "border-gray-300 dark:border-gray-600",
                "shadow-sm focus:border-primary-2 focus:ring-primary-2"
            )}
        />
    </div>
);

export default FormInput;
