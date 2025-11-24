// components/BlogLayout.tsx
'use client';

import Image from 'next/image';
import React from 'react';

interface BlogLayoutProps {
  title: string;
  date: string;
  heroSrc: string;
  children: React.ReactNode;
}

export default function BlogLayout({ title, date, heroSrc, children }: BlogLayoutProps) {
  return (
    <main className="bg-white dark:bg-main-bg-dark secondary-text dark:secondary-text min-h-screen py-8 px-4">
      <header className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
          {title}
        </h1>
        <p className="text-sm secondary-text dark:secondary-text">{date}</p>
        <Image
          src={heroSrc}
          alt={title}
          width={1200}
          height={600}
          className="w-full h-auto rounded-lg mt-6 shadow-md"
        />
      </header>

      {/* plugin @tailwindcss/typography para estilizar automáticamente h2, p, ul, etc */}
      <article className="prose dark:prose-dark max-w-3xl mx-auto">
        {children}
      </article>
    </main>
  );
}