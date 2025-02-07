import '@/styles/globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/redux/provider';
import { Footer, Navbar } from '@/components/common';
import { Setup } from '@/components/utils';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import MobileMenu from '@/components/navigation/MobileMenu';
import dynamic from 'next/dynamic';
import Script from 'next/script';
import LayoutWrapper from '@/components/common/LayoutWrapper';

const HeartEffect = dynamic(() => import('@/components/common/HeartEffect'), {
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
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet"></link>
      </head>
      <body
        className={`${inter.className} min-h-screen bg-white dark:bg-gray-900 dark:text-white flex flex-col relative`}
        suppressHydrationWarning
      >
        <Script id="mouseflow" strategy="afterInteractive">
          {`
            window._mfq = window._mfq || [];
            (function() {
              var mf = document.createElement("script");
              mf.type = "text/javascript"; mf.defer = true;
              mf.src = "//cdn.mouseflow.com/projects/67089cbf-94d0-4a51-93a7-c17259e44fc6.js";
              document.getElementsByTagName("head")[0].appendChild(mf);
            })();
          `}
        </Script>

        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-FBD3HVXC41"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-FBD3HVXC41');
          `}
        </Script>

        <Script id="tawk-to" strategy="afterInteractive">
          {`
            var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
            (function(){
              var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
              s1.async = true;
              s1.src = 'https://embed.tawk.to/67a5f217825083258e11a954/1ijg3jbdp';
              s1.charset = 'UTF-8';
              s1.setAttribute('crossorigin', '*');
              s0.parentNode.insertBefore(s1, s0);
            })();
          `}
        </Script>

        <Provider>
          <Setup />
          <HeartEffect />
          <LayoutWrapper>
            <div className="flex flex-col min-h-screen relative">
              <AnnouncementBar />
              <Navbar />
              <main className="flex-grow pb-16 md:pb-0 mx-4">
                {children}
              </main>
              <div className="hidden md:block">
                <Footer />
              </div>
              <div className="block md:hidden">
                <MobileMenu />
              </div>
            </div>
          </LayoutWrapper>
        </Provider>
      </body>
    </html>
  );
}
