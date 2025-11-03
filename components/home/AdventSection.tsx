import Image from 'next/image';
import Link from 'next/link';
import AdventCountdown from '@/components/common/AdventCountdown';

export default function AdventSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch rounded-xl overflow-hidden bg-[#977545]">
      <Link href="/shop-now/advent-calendar" className="relative min-h-[220px] md:min-h-[320px] block group">
        <Image
          src="/advent-calendar/2025/2.jpg"
          alt="Advent Calendar"
          width={800}
          height={0}
          sizes="100vw"
          style={{ objectFit: 'cover' }}
          priority={false}
          className="object-cover w-full h-auto transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/20 md:bg-black/10" />
      </Link>

      <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
        <h3 className="text-2xl md:text-3xl font-bold text-primary-button-text">
          Introducing the 2025 Advent Calendar
        </h3>
        {/* <h4 className="text-lg md:text-xl font-bold text-primary-button-text">
          Pre-order before 15th October for an exclusive discount
        </h4> */}
        {/* <AdventCountdown /> */}

        <p className="text-sm md:text-base text-primary-button-text">
          A 24-day countdown to Christmas with 24 delicious treats.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            href="/shop-now/advent-calendar"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
