import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/redux/provider';
import { Footer, Navbar } from '@/components/common';
import { Setup } from '@/components/utils';
import AnnouncementBar from '@/components/common/AnnouncementBar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CassPea Premium Chocolates',
  description: 'Full Auth application that provides jwt authentication',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col`}>
        <Provider>
          <Setup />
          <AnnouncementBar />
          <Navbar />
          {/* Main content that takes the available space */}
          <div className="flex-grow">
            {children}
          </div>
          {/* Footer is always at the bottom */}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
