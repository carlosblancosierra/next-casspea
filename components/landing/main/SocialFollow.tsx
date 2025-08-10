// app/landing/SocialFollow.tsx
'use client';

import Link from 'next/link';

interface SocialFollowProps { landing: string; bgClass?: string; }

export default function SocialFollow({ landing, bgClass }: SocialFollowProps) {
  return (
    <section className={`py-12 ${bgClass || 'bg-gray-900'} text-white px-4`}>
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">Come Behind the Scenes</h2>
      <p className="text-center mb-4">Follow us on Instagram and Facebook:</p>
      <div className="flex justify-center gap-6">
        <Link href="https://instagram.com/casspea_" target="_blank">Instagram</Link>
        <Link href="https://facebook.com/casspea_"  target="_blank">Facebook</Link>
      </div>
    </section>
  );
}