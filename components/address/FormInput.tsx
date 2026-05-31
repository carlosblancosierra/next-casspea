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
    title?: string;
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
    title,
    readOnly = false,
    placeholder,
}) => (
    <div className="space-y-1">
        <label htmlFor={id} className="block text-xs font-medium text-primary-text dark:text-primary-text-light">
            {label} {required && <span aria-hidden="true">*</span>}
        </label>
        <input
            type={type}
            id={id}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            aria-required={required || undefined}
            pattern={pattern}
            title={title}
            readOnly={readOnly}
            placeholder={placeholder}
            className={clsx(
                "mt-0.5 block w-full rounded-md border text-base",
                readOnly
                    ? "bg-gray-50 dark:bg-gray-900 cursor-not-allowed text-gray-500 dark:text-gray-400"
                    : "bg-main-bg dark:bg-main-bg-dark",
                "text-primary-text dark:text-primary-text-light",
                "border-gray-300 dark:border-gray-600",
                "shadow-sm focus:border-primary focus:ring-primary",
                "invalid:border-red-400 dark:invalid:border-red-500"
            )}
        />
    </div>
);

export default FormInput;
