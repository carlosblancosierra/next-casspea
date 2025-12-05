import Link from 'next/link';
import Image from 'next/image';

export default function GiveawayThankYou() {
  return (
    <main className="dark:bg-main-bg-dark max-w-screen-2xl md:mx-auto flex flex-col p-4 md:flex-row  md:justify-center">
      <section className="w-full max-w-lg bg-main-bg dark:bg-main-bg-dark rounded-lg shadow flex flex-col items-center">
          <Image
            src="/home/home-tm7.jpeg"
            alt="Win the Thermomix® TM7 + CassPea Chocolates"
            width={800}
            height={0}
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority={false}
            className="object-cover w-full h-auto transition-transform duration-300 mb-2"
          />
          <div className="p-4">
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-text dark:text-white mb-2 text-center">Thank You for Entering!</h1>
            <p className="text-lg text-primary-text dark:text-primary-text-light mb-6 text-center">
              Your entry for the Thermomix Giveaway has been received.<br />
              Good luck!
            </p>
            <div className="flex flex-col gap-2 items-center md:flex-row md:gap-4 md:justify-center">
              <Link href="/" className="mt-4 md:mt-0 px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition">
                Back to Home
              </Link>
              <Link href="/shop-now" className="mt-2 md:mt-0 px-6 py-3 bg-gray-200 dark:bg-main-bg-dark text-primary-text dark:text-white rounded-lg font-bold hover:bg-main-bg dark:hover:bg-gray-600 transition">
                Shop Now
              </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
