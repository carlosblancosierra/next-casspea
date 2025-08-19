'use client';

import React, { useState, useRef } from 'react';
import FormInput from '@/components/address/FormInput';
import FormSection from '@/components/address/FormSection';
import { useSubscribeGenericLeadMutation } from '@/redux/features/subscribe/subscribeApiSlice';
import { toast } from 'react-toastify';

export function EnterForm() {
  const [subscribeGenericLead, { isLoading: apiLoading, isError, error }] = useSubscribeGenericLeadMutation();

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await subscribeGenericLead({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        instagram_username: formData.instaHandle,
        lead_type: 'giveaway',
        form_code: 'TM7',
      }).unwrap();
      toast.success('Thank you! Your entry has been received. We will send you an email to confirm eligibility.');
    } catch (err) {
      toast.error('Failed to subscribe. Please try again.');
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      className="space-y-3"
      noValidate
    >
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