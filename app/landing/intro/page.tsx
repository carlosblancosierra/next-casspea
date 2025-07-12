// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { useState } from 'react';
import ImageGallery from '@/components/product_detail/ImageGallery';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });

export default function LandingPage() {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeroSection />
      <WhoWeAre />
      <SignatureBoxes />
      <Flavours />
      <WhyChooseUs />
      <CustomGifts />
      <Testimonials />
      <Newsletter />
      <SocialFollow />
      <Footer />
    </main>
  );
}

// 1. Hero
function HeroSection() {
  return (
    <section className="relative">
      <video
        src="/hero.mp4"
        autoPlay
        muted
        loop
        className="w-full h-[60vh] object-cover"
        poster="/landings/thermomix/intro/bg-1.jpg"
        onError={(e) => {
          const target = e.target as HTMLVideoElement;
          target.style.display = 'none';
          const fallback = document.getElementById('hero-fallback-img');
          if (fallback) fallback.style.display = 'block';
        }}
      />
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center px-4 text-center">
        <h1 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-shadow-md`}>
          Share the Love, One Bonbon at a Time
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-200">
          Luxury handmade chocolates crafted in London.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg text-white font-medium">
            Shop Now
          </Link>
          <Link href="#story" className="px-6 py-3 border border-white rounded-lg text-white font-medium">
            Explore Our Story
          </Link>
        </div>
      </div>
    </section>
  );
}

// 2. Who We Are
function WhoWeAre() {
  return (
    <section id="story" className="py-12 px-4 max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
      <div>
        <ImageGallery
            images={[
              '/home/easter/1.jpg',
              '/home/easter/2.jpg',
              '/home/easter/3.jpg',
              '/home/easter/4.jpg',
            ]}
            className="aspect-square rounded-lg shadow"
          />
      </div>
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Who We Are</h2>
        <p className="leading-relaxed">
          CassPea is a London-based chocolate brand, handcrafting bonbons with bold flavours, stunning designs, and a touch of joy. Founded by chefs with a passion for creativity, every chocolate is made with care — and made to be shared.
        </p>
        <Link href="/about" className="inline-block mt-4 text-pink-500 font-semibold">
          Meet the Makers →
        </Link>
      </div>
    </section>
  );
}

// 3. Signature Boxes
const BOXES = [
  { count: 9, label: 'A little treat, beautifully made.' },
  { count: 15, label: 'Our best-seller, bursting with flavour.' },
  { count: 24, label: 'For those who want it all.' },
  { count: 48, label: 'The most indulgent experience.' },
];

function SignatureBoxes() {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Pick Your Box</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {BOXES.map(box => (
            <div key={box.count} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <Image
                src={`/boxes/${box.count}.jpg`}
                alt={`${box.count} bonbons`}
                width={500}
                height={500}
                className="w-full h-auto rounded"
              />
              <h3 className="mt-4 text-xl font-semibold">{box.count} Bonbons</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{box.label}</p>
              <Link
                href={`/shop?box=${box.count}`}
                className="mt-4 inline-block px-5 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded"
              >
                Build Your Box
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 4. Flavours
const FLAVOURS = ['Passionfruit Caramel', 'Guava Cheesecake', 'Rhubarb & Custard'];

function Flavours() {
  return (
    <section className="py-12 px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">Bold. Beautiful. Unforgettable.</h2>
      <p className="max-w-2xl mx-auto text-center text-gray-600 dark:text-gray-400 mb-8">
        We create every bonbon from scratch with the finest ingredients, often inspired by nostalgic flavours or global favourites.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {FLAVOURS.map(name => (
          <div key={name} className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow text-center">
            <Image
              src={`/flavours/${name.toLowerCase().replace(/ & /g,'-').replace(/\s+/g,'-')}.jpg`}
              alt={name}
              width={400}
              height={400}
              className="w-full h-auto rounded"
            />
            <h3 className="mt-3 font-semibold">{name}</h3>
          </div>
        ))}
      </div>
    </section>
  );
}

// 5. Why Choose Us
const REASONS = [
  { icon: '🌱', text: 'Natural Ingredients' },
  { icon: '🎨', text: 'Edible Art' },
  { icon: '📦', text: 'Eco-Friendly Packaging' },
  { icon: '❤️', text: 'Small Batch Production' },
  { icon: '🌈', text: 'Inclusive & Joyful Brand' },
];

function WhyChooseUs() {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Handcrafted with Purpose</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6 text-center">
          {REASONS.map(r => (
            <div key={r.text}>
              <div className="text-4xl mb-2">{r.icon}</div>
              <p className="font-medium">{r.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 6. Custom & Corporate
function CustomGifts() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        <Image
          src="/images/custom-box.jpg"
          alt="Custom Gifts"
          width={800}
          height={600}
          className="w-full h-auto rounded-lg shadow"
        />
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Make It Personal</h2>
          <p className="mb-6">
            Perfect for weddings, birthdays, corporate gifting and events. Choose your colours, flavours, and packaging.
          </p>
          <Link href="/custom" className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-lg">
            Request a Custom Order
          </Link>
        </div>
      </div>
    </section>
  );
}

// 7. Testimonials
const TESTIMONIALS = [
  { name: 'Emma', text: 'Los chocolates más deliciosos que he probado.' },
  { name: 'Liam', text: 'Perfectos para regalar, ¡volveré a comprar!' },
];

function Testimonials() {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800 px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Loved by Chocolate Lovers</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {TESTIMONIALS.map((t, i) => (
          <blockquote key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <p className="italic">“{t.text}”</p>
            <footer className="mt-4 text-right font-semibold">— {t.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

// 8. Newsletter
function Newsletter() {
  const [email, setEmail] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // lógica de suscripción...
  };
  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Get 10% Off Your First Order</h2>
        <p className="mb-6 text-gray-600 dark:text-gray-400">
          Plus early access to new flavours, limited drops, and special offers.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="Your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring focus:ring-pink-300"
          />
          <button type="submit" className="px-6 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-lg">
            Subscribe
          </button>
        </form>
      </div>
    </section>
  );
}

// 9. Social
function SocialFollow() {
  return (
    <section className="py-12 bg-gray-900 text-white px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">Come Behind the Scenes</h2>
      <div className="max-w-4xl mx-auto">
        {/* Aquí podrías insertar embed de IG Reel o grid de imágenes */}
        <p className="text-center mb-4">Síguenos en Instagram y TikTok:</p>
        <div className="flex justify-center gap-6">
          <Link href="https://instagram.com/casspea_" target="_blank">Instagram</Link>
          <Link href="https://tiktok.com/@casspea_" target="_blank">TikTok</Link>
        </div>
      </div>
    </section>
  );
}

// 10. Footer
function Footer() {
  return (
    <footer className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-8 px-4">
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