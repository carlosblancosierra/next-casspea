'use client';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import * as C from './contants';

const IG_URL_UTM = `${C.INSTAGRAM_URL}?utm_source=website&utm_medium=landing&utm_campaign=tm7_giveaway`;

export default function ButtonGroup() {
  return (
    <div className="hidden md:flex gap-2 mt-8">
      <a
        href={IG_URL_UTM}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-colors bg-blue-600 hover:bg-blue-700"
      >
        {C.BUTTON_FOLLOW_TEXT}
        <FaInstagram className="ml-2 -mr-1" size={20} />
      </a>
      <Link
        href={C.SUBSCRIBE_PAGE_PATH}
        className="inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-colors bg-green-600 hover:bg-green-700"
      >
        {C.BUTTON_SUBSCRIBE_TEXT}
      </Link>
    </div>
  );
}