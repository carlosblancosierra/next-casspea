import '@/styles/globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/redux/provider';
import { Footer, Navbar } from '@/components/common';
import { Setup } from '@/components/utils';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import MobileMenu from '@/components/navigation/MobileMenu';
import dynamic from 'next/dynamic';
const SnowEffect = dynamic(() => import('@/components/common/SnowEffect'), {
  ssr: false
});

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });
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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col relative`}
        suppressHydrationWarning
      >
        <Provider>
          <Setup />
          <SnowEffect />
          <div className="flex flex-col min-h-screen relative">
            <AnnouncementBar />
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">
              {children}
            </main>
            <div className="hidden md:block">
              <Footer />
            </div>
            <div className="block md:hidden">
              <MobileMenu />
            </div>
          </div>
        </Provider>
      </body>
    </html>
  );
}
