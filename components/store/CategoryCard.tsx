import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Category {
  name: string;
  slug: string;
  description?: string;
  image?: string;
}

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const displayImage = category.image || '/images/default-category.png';

  return (
    <Link
      href={`/shop-now/categories/${category.slug}`}
      className="block group relative shadow-lg rounded-lg p-0 border border-gray-200 dark:border-gray-700 bg-main-bg dark:bg-gray-800 hover:opacity-90 transition-opacity"
    >
      <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-t-lg bg-gray-200 dark:bg-gray-700 lg:aspect-none group-hover:opacity-75">
        <Image
          alt={category.name}
          src={displayImage}
          width={0}
          height={0}
          sizes="100vw"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{category.name}</h3>
        {category.description && (
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">{category.description}</p>
        )}
      </div>
    </Link>
  );
}