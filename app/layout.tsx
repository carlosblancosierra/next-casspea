import '@/styles/globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/redux/provider';
import { Footer, Navbar } from '@/components/common';
import { Setup } from '@/components/utils';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import MobileMenu from '@/components/navigation/MobileMenu';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CassPea Premium Chocolates',
  description: 'Handcrafted premium chocolates and confectionery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col relative`}
        suppressHydrationWarning
      >
        <Provider>
          <Setup />
          <div className="flex flex-col min-h-screen">
            <AnnouncementBar />
            <Navbar />

            {/* Main content wrapper */}
            <main className="flex-grow pb-16 md:pb-0">
              {children}
            </main>

            {/* Footer - hidden on mobile */}
            <div className="hidden md:block">
              <Footer />
            </div>

            {/* Mobile menu - visible only on mobile */}
            <div className="block md:hidden">
              <MobileMenu />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
