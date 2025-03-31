"use client";
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link'

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="relative isolate overflow-hidden px-6 py-2.5 sm:px-3.5">
      <div
        aria-hidden="true"
        className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
        />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-2 md:gap-x-6 max-w-screen-2xl mx-auto text-gray-900 dark:text-white">
        <div className="flex flex-col md:flex-row flex-1 justify-center items-center gap-y-2 md:gap-x-8 w-full">
          <p className="text-sm leading-6 w-full md:w-auto text-center">
          <div className="">
            <div className="flex flex-row items-center gap-x-2 justify-center">
                <Image
                    src="/home/stars-4.5.svg"
                    alt="Trustpilot Starts 4.3"
                    width={100}
                    height={100}
                    className="inline-block"
                />
                <a href="https://uk.trustpilot.com/review/www.casspea.co.uk" className="text-sm font-medium inline-block">
                    4.4 on Trustpilot
                </a>
            </div>
            </div>
          </p>
          <p className="text-sm leading-6 w-full md:w-auto text-center">
            Tel: 07859 790386 / email: info@casspea.co.uk
          </p>
          <p className="text-sm leading-6 w-full md:w-auto text-center">
            Free Shipping over £50
          </p>
          <Link
            href="/subscribe"
            className="w-full md:w-auto text-center rounded-full
            bg-gradient-to-r from-[#ff007e] to-[#ff3b9d]
            px-3.5 py-1 text-sm text-white shadow-sm hover:bg-primary-light"
          >
            Subscribe for 10% off <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>

        <button
          type="button"
          className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-2 hover:bg-gray-100 rounded-full"
          onClick={handleClose}
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="h-5 w-5 text-gray-900 dark:text-white" />
        </button>
      </div>
    </div>
  )
}
