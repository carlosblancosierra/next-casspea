import React from 'react';
import { FaStar } from 'react-icons/fa';
import Image from 'next/image';

const reviews = [
  {
    name: 'Dani James',
    date: '17 May 2024',
    rating: 5,
    title: 'Look and taste amazing!',
    review: "Fast delivery, great box and gorgeous, delicious chocolates. Highly recommend!",
  },
  {
    name: 'Hannah',
    date: '5 Apr 2024',
    rating: 5,
    title: 'Amazing chocolates and lovely company.',
    review: 'The chocolates taste absolutely amazing and each one is like a piece of art.',
  },
  {
    name: 'Rosie Shaw',
    date: '19 Mar 2024',
    rating: 5,
    title: 'Beautiful gift',
    review: "These have to be some of the most beautiful chocolates I've ever seen!",
  },
  {
    name: 'Sian Lindstrom',
    date: '9 Sept 2023',
    rating: 5,
    title: 'Above and beyond',
    review: 'The chocolates and customer service is fab and I recommend.',
  },
];

const Reviews = () => {
  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex flex-col space-y-2 bg-main-bg dark:bg-main-bg-dark p-4 rounded-lg shadow-md dark:shadow-lg border border-gray-100 dark:border-gray-800"
          >
            <div className="flex items-center gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <FaStar key={i} className="w-3 h-3 text-yellow-400" />
              ))}
            </div>
            <h4 className="text-sm font-semibold text-primary-text dark:text-primary-text-light">
              {review.title}
            </h4>
            <p className="text-xs text-primary-text dark:text-primary-text-light flex-1">
              {review.review}
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{review.name}</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{review.date}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Trustpilot link */}
      <div className="flex items-center justify-center gap-3">
        <Image
          src="/home/stars-4.5.svg"
          alt="Trustpilot 4.7 stars"
          width={80}
          height={20}
        />
        <a
          href="https://uk.trustpilot.com/review/www.casspea.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline font-medium"
        >
          Read all 66 reviews on Trustpilot →
        </a>
      </div>
    </div>
  );
};

export default Reviews;
