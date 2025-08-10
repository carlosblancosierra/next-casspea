// app/landing/WhyChooseUs.tsx
'use client';

const REASONS = [
  { icon: '🍫', text: 'Almost too pretty to eat' },
  { icon: '🌱', text: 'Natural Ingredients' },
  { icon: '🎨', text: 'Edible Art' },
  { icon: '📦', text: 'Handmade in London' },
  { icon: '❤️', text: 'Small Batch Production' },
  { icon: '🌈', text: 'Inclusive & Joyful Brand' },
];

interface WhyChooseUsProps { landing: string; }

export default function WhyChooseUs({ landing }: WhyChooseUsProps) {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Handcrafted with Purpose</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 text-center">
          {REASONS.map(r => (
            <div key={r.text}>
              <div className="text-6xl mb-2">{r.icon}</div>
              <p className="font-medium">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}