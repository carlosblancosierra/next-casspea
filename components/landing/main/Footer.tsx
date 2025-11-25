// app/landing/Footer.tsx
'use client';

import Link from 'next/link';

interface FooterProps { config: typeof import('../constants').LANDING_CONFIG.gold; }

export default function Footer({ config }: FooterProps) {
  return (
    <footer className="bg-main-bg dark:bg-main-bg-dark text-primary-text dark:text-primary-text py-8 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <h3 className="font-semibold mb-2">Shop</h3>
          <Link href="/shop">All Products</Link><br/>
          <Link href="#flavours">Flavours</Link><br/>
          <Link href="/custom">Custom Orders</Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Company</h3>
          <Link href="/about">About Us</Link><br/>
          <Link href="/contact">Contact</Link><br/>
          <Link href="/faqs">FAQs</Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Legal</h3>
          <Link href="/terms">Terms</Link><br/>
          <Link href="/privacy-policy">Privacy</Link>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p>info@casspea.co.uk</p>
          <p>London, UK</p>
        </div>
      </div>
      <p className="text-center text-sm mt-6">&copy; {new Date().getFullYear()} CassPea. All rights reserved.</p>
    </footer>
  );
}