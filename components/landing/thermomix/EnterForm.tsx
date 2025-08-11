'use client';

import React, { useState, useRef } from 'react';
import FormInput from '@/components/address/FormInput';
import FormSection from '@/components/address/FormSection';

export function EnterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    instaHandle: '',
    email: '',
  });
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: replace with actual submission logic (e.g. API call)
    console.log('Form submitted:', formData);
    alert(
      'Thank you! Your entry has been received. We will send you an email to confirm eligibility.'
    );
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-3" noValidate>
      <FormSection>
        <FormInput
          id="firstName"
          name="firstName"
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          required
        />
        <FormInput
          id="lastName"
          name="lastName"
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          required
        />
      </FormSection>
      <FormInput
        id="address"
        name="address"
        label="Address"
        value={formData.address}
        onChange={handleChange}
        required
      />
      <FormInput
        id="instaHandle"
        name="instaHandle"
        label="Instagram Handle"
        value={formData.instaHandle}
        onChange={handleChange}
        required
        placeholder="@yourusername"
      />
      <FormInput
        id="email"
        name="email"
        type="email"
        label="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300"
      >
        Submit Entry
      </button>
    </form>
  );
}