"use client";

import { XMarkIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Constants
const HIDDEN_PATHS = ['/blog', '/landing/gold'];
const BACKGROUND_COLOR = "#6f0f11";

type AnnouncementLink = {
  href: string;
  text: string;
};

const CONTACT_INFO = {
  phone: { number: "07859 790386", href: "tel:07859790386" },
  email: { address: "info@casspea.co.uk", href: "mailto:info@casspea.co.uk" }
};

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);
  const pathname = usePathname();
  
  // Early return if on excluded paths
  if (HIDDEN_PATHS.some(path => pathname?.startsWith(path))) return null;

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText('SUBSCRIBER15');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  if (!isVisible) {
    return null;
  }

  const renderTrustpilotRating = () => (
    <div className="flex items-center gap-x-2 justify-center">
      <Image
        src="/home/stars-4.5.svg"
        alt="Trustpilot Rating 4.4"
        width={100}
        height={100}
        className="inline-block"
      />
      <a
        href="https://uk.trustpilot.com/review/www.casspea.co.uk"
        className="text-sm font-medium inline-block text-primary-text-light hover:underline"
        rel="noopener noreferrer"
        target="_blank"
      >
        4.4 on Trustpilot
      </a>
    </div>
  );
  
  const renderContactInfo = () => (
    <p className="text-sm leading-6 w-full md:w-auto text-center text-primary-text-light">
      Tel: <a
        href={CONTACT_INFO.phone.href}
        className="underline hover:no-underline transition underline-offset-2 text-primary-text-light"
      >
        {CONTACT_INFO.phone.number}
      </a> / email: <a
        href={CONTACT_INFO.email.href}
        className="underline hover:no-underline transition underline-offset-2 text-primary-text-light"
      >
        {CONTACT_INFO.email.address}
      </a>
    </p>
  );
  
  return (
    <div 
      className="relative isolate overflow-hidden px-6 py-2.5 sm:px-3.5" 
      style={{ backgroundColor: BACKGROUND_COLOR }}
    >
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-2 md:gap-x-6 max-w-screen-2xl mx-auto text-primary-text-light">
        <div className="flex flex-col md:flex-row flex-1 justify-center items-center gap-y-2 md:gap-x-8 w-full">
          <div className="text-sm leading-6 w-full md:w-auto text-center">
            {renderTrustpilotRating()}
          </div>
          
          {/* {renderContactInfo()} */}
          
          <p className="text-sm leading-6 w-full md:w-auto text-center text-primary-text-light">
            🎄 Holiday Notice: All orders will be dispatched on <span className="font-semibold text-yellow-300">January 10th</span> 🎄
            {/* Free Shipping over £50 */}
          </p>
          
          <Link
            href="/subscribe"
            className="w-full md:w-auto text-center rounded-full bg-red-600 px-3.5 py-1 text-sm text-white shadow-sm hover:bg-primary-light transition"
          >
            Subscribe for 10% off <span aria-hidden="true">&rarr;</span>
          </Link>

        </div>

        <button
          type="button"
          className="absolute top-2 right-2 md:relative md:top-auto md:right-auto p-2 hover:bg-gray-100/20 rounded-full transition"
          onClick={handleClose}
          aria-label="Dismiss announcement"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon aria-hidden="true" className="h-5 w-5 text-primary-text-light" />
        </button>
      </div>
    </div>
  )
}
