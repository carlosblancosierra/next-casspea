'use client';

import { useState } from 'react';

export function EnterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    instaHandle: '',
    email: '',
  });

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
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <div>
        <label htmlFor="firstName" className="block font-medium mb-1">
          First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          required
          value={formData.firstName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="lastName" className="block font-medium mb-1">
          Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          required
          value={formData.lastName}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="address" className="block font-medium mb-1">
          Address
        </label>
        <textarea
          id="address"
          name="address"
          required
          value={formData.address}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="instaHandle" className="block font-medium mb-1">
          Instagram Handle
        </label>
        <input
          type="text"
          id="instaHandle"
          name="instaHandle"
          required
          placeholder="@yourusername"
          value={formData.instaHandle}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="email" className="block font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formData.email}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 focus:ring-4 focus:ring-purple-300"
      >
        Submit Entry
      </button>
    </form>
  );
}