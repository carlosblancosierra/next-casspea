// app/page.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Playfair_Display } from 'next/font/google';
import { useState } from 'react';
import ImageGallery from '@/components/product_detail/ImageGallery';
import ProductCard from '@/components/store/ProductCard';
import { useGetFlavoursQuery } from '@/redux/features/flavour/flavourApiSlice';
import { Flavour } from '@/types/flavours';
import NewsletterSubscribe from '@/components/newsletter/NewsletterSubscribe';
import { useGetCategoriesQuery } from '@/redux/features/products/productApiSlice';
import CategoryCard from '@/components/store/CategoryCard';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['700'] });

export default function LandingPage() {
  return (
    <main className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <HeroSection />
      <WhoWeAre />
      <SignatureBoxes />
      <OtherCategories />
      <FlavourGrid />
      {/* <Flavours /> */}
      <WhyChooseUs />
      <CustomGifts />
      <Testimonials />
      <NewsletterSubscribe />
      <SocialFollow />
      {/* <Footer /> */}
    </main>
  );
}

// 1. Hero
function HeroSection() {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Image
          src="/landings/intro/bg-1.jpg"
          alt="Hero background"
          fill
          className="object-cover w-full h-full"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 text-center">
        <h1 className={`${playfair.className} text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white text-shadow-md`}>
          Share the Love, One Bonbon at a Time
        </h1>
        <p className="mt-4 text-lg sm:text-xl text-gray-200">
          Luxury handmade chocolates crafted in London.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/shop-now" className="px-6 py-3 bg-pink-500 hover:bg-pink-600 rounded-lg text-white font-medium">
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
        <Link href="/about-us" className="inline-block mt-4 text-pink-500 font-semibold">
          Meet the Makers →
        </Link>
      </div>
    </section>
  );
}

// 3. Signature Boxes
const BOX_PRODUCTS = [
  {
    id: 1,
    name: 'Box of 9 Bonbons',
    slug: 'box-of-9',
    image: '/landings/intro/boxes/9.jpeg',
    base_price: '15.00',
    weight: 135,
    gallery_images: [],
  },
  {
    id: 2,
    name: 'Box of 15 Bonbons',
    slug: 'box-of-15',
    image: '/landings/intro/boxes/15.jpeg',
    base_price: '22.00',
    weight: 225,
    gallery_images: [],
  },
  {
    id: 3,
    name: 'Box of 24 Bonbons',
    slug: 'box-of-24',
    image: '/landings/intro/boxes/24.jpeg',
    base_price: '35.00',
    weight: 360,
    gallery_images: [],
  },
  {
    id: 4,
    name: 'Box of 48 Bonbons',
    slug: 'box-of-48',
    image: '/landings/intro/boxes/48.jpeg',
    base_price: '65.00',
    weight: 720,
    gallery_images: [],
  },
];

function SignatureBoxes() {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Pick Your Box</h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
          Our signature boxes are the perfect way to share the love. From 9 to 48 bonbons, we have a box for every occasion.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-1">
          {BOX_PRODUCTS.map(product => (
            <ProductCard key={product.id} product={product} />
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
  { icon: '🍫', text: 'Almost too pretty to eat' },
  { icon: '🌱', text: 'Natural Ingredients' },
  { icon: '🎨', text: 'Edible Art' },
  { icon: '📦', text: 'Handmade in London' },
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
          src="/landings/intro/packs.jpg"
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
  {
    name: 'Saf Teli',
    country: 'GB',
    reviews: 1,
    rating: 5,
    date: 'Jun 21, 2025',
    text: 'These were recommended to me by a friend who loved them. I ordered some for myself and also as a thank you gift. They were wonderful and were appreciated by the recipient too. The customer service was also brilliant as they were super responsive and solution focused when I reached out. Highly recommend!',
    experience: 'April 28, 2025'
  },
  {
    name: 'Kate W',
    country: 'GB',
    reviews: 2,
    rating: 5,
    date: 'Mar 3, 2025',
    text: 'Brought these as a 50th birthday present for my friend who loves her chocolate, she loved them and has since brought them as gifts herself. Beautiful chocolates presented in a lovely box & she assures me they were delicious.',
    experience: 'November 10, 2024'
  },
  {
    name: 'John Ng',
    country: 'GB',
    reviews: 18,
    rating: 5,
    date: 'Mar 11, 2025',
    text: 'Excellent, and beautiful chocolates!! I have ordered a couple times from casspea and the packaging is beautiful. I like how they now include a menu in thier boxes too. Excellent gifts, and wonderful flavours overall. Highly recommend',
    experience: 'March 10, 2025'
  },
];

function Testimonials() {
  return (
    <section className="py-12 bg-gray-100 dark:bg-gray-800 px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-8">Loved by Chocolate Lovers</h2>
      <div className="max-w-3xl mx-auto space-y-6">
        {TESTIMONIALS.map((t, i) => (
          <blockquote key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
            <div className="flex items-center gap-3 mb-2">
              <span className="font-semibold text-lg">{t.name}</span>
              {t.country && <span className="text-xs text-gray-400">{t.country}</span>}
              {t.reviews && <span className="text-xs text-gray-400">• {t.reviews} review{t.reviews > 1 ? 's' : ''}</span>}
            </div>
            {t.rating && (
              <div className="flex items-center gap-1 mb-1">
                {Array.from({ length: t.rating }).map((_, idx) => (
                  <span key={idx} className="text-yellow-400">★</span>
                ))}
                <span className="text-xs text-gray-500 ml-2">Rated {t.rating} out of 5 stars</span>
              </div>
            )}
            {t.date && <div className="text-xs text-gray-400 mb-2">{t.date}</div>}
            <p className="italic">“{t.text}”</p>
            {t.experience && (
              <div className="mt-2 text-xs text-gray-500">Date of experience: {t.experience}</div>
            )}
            {!t.rating && !t.date && <footer className="mt-4 text-right font-semibold">— {t.name}</footer>}
          </blockquote>
        ))}
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
        <p className="text-center mb-4">Follow us on Instagram and Facebook:</p>
        <div className="flex justify-center gap-6">
          <Link href="https://instagram.com/casspea_" target="_blank">Instagram</Link>
          <Link href="https://facebook.com/casspea_" target="_blank">Facebook</Link>
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

function FlavourGrid() {
  const { data: flavours, isLoading, error } = useGetFlavoursQuery();
  if (isLoading) return <div className="text-center py-12">Loading...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error loading flavours.</div>;
  return (
    <section className="py-12 px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">All Our Flavours</h2>
      <div className="grid grid-cols-4 md:grid-cols-12 gap-2 max-w-6xl mx-auto">
        {flavours?.map((flavour: Flavour) => (
          <div key={flavour.id} className="aspect-square w-full overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <Image
              src={flavour.image || flavour.thumbnail || '/flavours/default.png'}
              alt=""
              fill
              style={{ objectFit: 'contain' }}
              className="w-full h-full"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

// Section: Other Categories (not signature-boxes)
function OtherCategories() {
  const { data: categories, isLoading, error } = useGetCategoriesQuery();
  if (isLoading) return <div className="text-center py-12">Loading categories...</div>;
  if (error) return <div className="text-center py-12 text-red-500">Error loading categories.</div>;
  if (!categories) return null;
  const filtered = categories.filter((cat) => cat.slug !== 'signature-boxes');
  if (filtered.length === 0) return null;
  return (
    <section className="py-12 px-4">
      <h2 className="text-center text-2xl sm:text-3xl font-bold mb-6">Explore More Categories</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-4xl mx-auto">
        {filtered.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}