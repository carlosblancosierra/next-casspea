import '@/styles/globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/redux/provider';
import { Footer, Navbar } from '@/components/common';
import { Setup } from '@/components/utils';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import Script from 'next/script';
import LayoutWrapper from '@/components/common/LayoutWrapper';
import GiveawayPopup from '@/components/common/GiveawayPopup';
import dynamic from 'next/dynamic';
import LastCallChristmasPopup from '@/components/common/LasCallChirstmasPopup';

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
        <Script id="gtm-head" strategy="beforeInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TWQTXVNR');
          `}
        </Script>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&display=swap" rel="stylesheet"></link>
      </head>
      <body
        className={`${inter.className} min-h-screen bg-main-bg dark:bg-main-bg-dark dark:text-white flex flex-col relative`}
        suppressHydrationWarning
      >
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWQTXVNR"
            height="0" width="0" style={{display:'none', visibility:'hidden'}}></iframe>
        </noscript>
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

        <Script id="google-ads" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID}');
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

        <script id="Cookiebot" src="https://consent.cookiebot.com/uc.js" data-cbid="7ef907d7-ea0d-4a43-beec-ca187e2ea5cd" data-blockingmode="auto" type="text/javascript"></script>
        <Provider>
          <Setup />
          {/* <GiveawayPopup /> */}
          <LastCallChristmasPopup />
          <LayoutWrapper>
            <div className="flex flex-col min-h-screen relative z-1">
              <AnnouncementBar />
              <Navbar />
              <main className="flex-grow pt-2 pb-16 md:pb-0 mx-4">
                {children}
              </main>
              <div className="hidden md:block">
                <Footer />
              </div>
              <SnowEffect />
            </div>
          </LayoutWrapper>
        </Provider>
      </body>
    </html>
  );
}
