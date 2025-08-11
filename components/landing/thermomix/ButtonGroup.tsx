'use client';
import Link from 'next/link';
import { FaInstagram } from 'react-icons/fa';
import * as C from './contants';

const IG_URL_UTM = `${C.INSTAGRAM_URL}?utm_source=website&utm_medium=landing&utm_campaign=tm7_giveaway`;

export default function ButtonGroup() {
  return (
    <div className="flex flex-col md:flex-row gap-2 my-2 w-full">
      <a
        href={IG_URL_UTM}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-colors bg-my-pink hover:bg-pink-700"
      >
        {C.BUTTON_FOLLOW_TEXT}
        <FaInstagram className="ml-2 -mr-1" size={20} />
      </a>
      <Link
        href={C.SUBSCRIBE_PAGE_PATH}
        className="w-full inline-flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-colors bg-my-red hover:bg-red-700"
      >
        {C.BUTTON_SUBSCRIBE_TEXT}
      </Link>
    </div>
  );
}