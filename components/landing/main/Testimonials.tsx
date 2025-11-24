// app/landing/Testimonials.tsx
'use client';

const TESTIMONIALS = [
  {
    name: 'Saf Teli', country: 'GB', reviews: 1, rating: 5,
    date: 'Jun 21, 2025',
    text: 'These were recommended to me by a friend who loved them...',
    experience: 'April 28, 2025'
  },
  {
    name: 'Kate W', country: 'GB', reviews: 2, rating: 5,
    date: 'Mar 3, 2025',
    text: 'Brought these as a 50th birthday present for my friend...',
    experience: 'November 10, 2024'
  },
  {
    name: 'John Ng', country: 'GB', reviews: 18, rating: 5,
    date: 'Mar 11, 2025',
    text: 'Excellent, and beautiful chocolates!! I have ordered a couple times...',
    experience: 'March 10, 2025'
  },
];

interface TestimonialsProps { config: typeof import('../constants').LANDING_CONFIG.gold; }

export default function Testimonials({ config }: TestimonialsProps) {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800 px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Loved by Chocolate Lovers</h2>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <blockquote key={i} className="bg-white dark:bg-main-bg-dark p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-lg">{t.name}</span>
              <span className="text-xs secondary-text">• {t.reviews} review{t.reviews>1?'s':''}</span>
              <span className="text-xs secondary-text ml-auto">{t.country}</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-yellow-400">★</span>)}
              <span className="text-xs secondary-text ml-2">Rated {t.rating} out of 5</span>
            </div>
            <div className="text-xs secondary-text mb-2">{t.date}</div>
            <p className="italic">“{t.text}”</p>
            <div className="mt-2 text-xs secondary-text">Date of experience: {t.experience}</div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}