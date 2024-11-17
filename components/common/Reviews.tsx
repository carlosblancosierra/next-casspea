import React from 'react';
import { FaStar } from 'react-icons/fa';

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
    review: 'These have to be some of the most beautiful chocolates I\'ve ever seen!',
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
    <div className="">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="flex space-x-2 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md dark:shadow-lg"
          >
            <div>
              <p className="text-[10px] text-gray-500 dark:text-gray-400">
                {review.date}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {review.name}
              </p>
              <div className="flex items-center">
                {[...Array(review.rating)].map((_, i) => (
                  <FaStar key={i} className="w-3 h-3 text-yellow-400" />
                ))}
              </div>
              <h4 className="text-xs font-medium text-gray-900 dark:text-gray-100 mt-1">
                {review.title}
              </h4>
              <p className="text-xs mt-1 text-gray-600 dark:text-gray-300">
                {review.review}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
