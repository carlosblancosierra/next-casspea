import Image from 'next/image';
import Link from 'next/link';
import { getProduct } from '@/utils/products';

/**
 * Restored from the dead-code sweep that removed it (it had been left
 * unimported). No countdown this time: the one that shipped with it hardcoded a
 * target of 15 Oct 2025 and was already commented out, so it would only render
 * zeros.
 *
 * The link resolves a product by slug, so it needs an active `advent-calendar`
 * product to land anywhere.
 *
 * The picture comes from that product too, so it can be changed in the admin:
 * its wide image (this slot is landscape), else its main image, else the 2025
 * photo shipped in public/.
 */
export const ADVENT_SLUG = 'advent-calendar';
const ADVENT_HREF = `/shop-now/${ADVENT_SLUG}`;
const FALLBACK_IMAGE = '/advent-calendar/2025/2.jpg';

export default async function AdventSection() {
  const product = await getProduct(ADVENT_SLUG);
  const imageSrc = product?.wide_image || product?.image || FALLBACK_IMAGE;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch rounded-xl overflow-hidden bg-[#977545]">
      <Link href={ADVENT_HREF} className="relative min-h-[220px] md:min-h-[320px] block group">
        <Image
          src={imageSrc}
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
          Introducing the 2026 Advent Calendar
        </h3>
        <p className="text-sm md:text-base text-primary-button-text">
          A 24-day countdown to Christmas with 24 delicious treats.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <Link
            href={ADVENT_HREF}
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
}
