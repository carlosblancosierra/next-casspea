'use client';
import { Suspense } from 'react';
import LoadingSection from '@/components/landing/thermomix/LoadingSection';

export default function Section({
  title,
  children,
  extraClass = '',
  id,
}: {
  title?: string;
  children: React.ReactNode;
  extraClass?: string;
  id?: string;
}) {
  return (
    <Suspense fallback={<LoadingSection />}>
      <section id={id} className={`py-2 px-4 max-w-5xl mx-auto ${extraClass}`}>
        {title ? <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">{title}</h2> : null}
        {children}
      </section>
    </Suspense>
  );
}