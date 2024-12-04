import React from 'react';

interface FormSectionProps {
    children: React.ReactNode;
}

const FormSection: React.FC<FormSectionProps> = ({ children }) => (
    <div className="grid grid-cols-2 gap-3">
        {children}
    </div>
);

export default FormSection; 
