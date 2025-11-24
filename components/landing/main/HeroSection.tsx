// app/landing/HeroSection.tsx
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import UnitSoldCounter from '@/components/common/UnitSoldCounter';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });

interface HeroSectionProps {
  config: typeof import('../constants').LANDING_CONFIG.gold;
}

export default function HeroSection({ config }: HeroSectionProps) {
  const bgRef = useRef<HTMLDivElement | null>(null);

  // Parallax ligero con rAF (se desactiva si el usuario prefiere reducir movimiento)
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    let raf = 0;
    const onScroll = () => {
      if (!bgRef.current) return;
      const y = window.scrollY || 0;
      // factor 0.3: slower movement than scroll
      bgRef.current.style.transform = `translateY(${y * 0.3}px) scale(1.2)`; // increased scale for full coverage
    };
    const loop = () => { onScroll(); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section id="lead-capture-twenty-off" className="scroll-mt-24 relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden mt-2">
      {/* Capa de fondo con parallax */}
      <div
        ref={bgRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 will-change-transform"
      >
        <Image
          src={config.hero.bgImage}
          alt=""
          fill
          priority
          className="object-cover w-full h-full"
        />
        <div className={`absolute inset-0 ${config.hero.overlayClassName}`} />
        {/* Sutil gradiente para legibilidad en la base */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 md:px-8 text-center">
        <h1
          className={`${playfair.className} text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]`}
        >
          {config.hero.heading}
        </h1>

        <p className="mt-4 max-w-2xl text-base md:text-xl text-primary-text/90">
          {config.hero.subheading}
        </p>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <a
            href="#enter-form"
            aria-label={config.hero.mainBtnAriaLabel}
            className={`
              inline-flex items-center justify-center px-7 py-3 rounded-lg font-medium
              transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
              ${config.hero.ctaBgClass}
              ${config.hero.ctaTextClass}
            `}
          >
            {config.hero.mainBtnLabel}
          </a>

          <Link
            href="/shop-now"
            aria-label={config.hero.secondaryBtnAriaLabel}
            className="
              inline-flex items-center justify-center px-7 py-3 rounded-lg font-medium
              border border-white/80 text-white/95 backdrop-blur-[2px]
              hover:bg-white/10 transition-colors
              focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70
            "
          >
            {config.hero.secondaryBtnLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}