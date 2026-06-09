import '@/styles/globals.css';
import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import Provider from '@/redux/provider';
import { Footer, Navbar } from '@/components/common';
import { Setup } from '@/components/utils';
import AnnouncementBar from '@/components/common/AnnouncementBar';
import Script from 'next/script';
import LayoutWrapper from '@/components/common/LayoutWrapper';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import UTMCapture from '@/components/utils/UTMCapture';

// Available effects - add new effects here
type EffectType = 'snow' | 'heart' | 'autumn' | 'none';

const EFFECTS_CONFIG: Record<EffectType, () => Promise<{ default: React.ComponentType }>> = {
  snow: () => import('@/components/common/SnowEffect'),
  heart: () => import('@/components/common/HeartEffect'),
  autumn: () => import('@/components/common/AutumEffect'),
  none: () => Promise.resolve({ default: () => null })
};

// Change this constant to switch effects - can be 'snow', 'heart', 'autumn', or 'none'
const CURRENT_EFFECT: EffectType = 'none';

const CurrentEffect = dynamic(EFFECTS_CONFIG[CURRENT_EFFECT], { ssr: false });



const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.casspea.co.uk'),
  title: {
    default: 'CassPea Premium Chocolates',
    template: '%s | CassPea',
  },
  description: 'Luxury handcrafted chocolates and gift boxes, made in London. Over 20 exquisite flavours for birthdays, corporate gifts and celebrations.',
  openGraph: {
    siteName: 'CassPea Chocolates',
    type: 'website',
    locale: 'en_GB',
  },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'CassPea Chocolates',
              url: 'https://www.casspea.co.uk',
              logo: 'https://www.casspea.co.uk/logos/red.png',
              email: 'info@casspea.co.uk',
              telephone: '+447859790386',
              address: {
                '@type': 'PostalAddress',
                streetAddress: '104 Bedford Hill',
                addressLocality: 'London',
                postalCode: 'SW12 9HR',
                addressCountry: 'GB',
              },
            }),
          }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-main-bg dark:bg-main-bg-dark dark:text-white flex flex-col relative`}
        suppressHydrationWarning
      >
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TWQTXVNR"
            height="0" width="0" style={{ display: 'none', visibility: 'hidden' }}></iframe>
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
          <Suspense fallback={null}>
            <UTMCapture />
          </Suspense>
          {/* <GiveawayPopup /> */}
          <LayoutWrapper>
            <div className="flex flex-col min-h-screen relative z-1">
              <AnnouncementBar />
              <Navbar />
              <main className="flex-grow pt-2 pb-16 md:pb-0 mx-4">
                {children}
              </main>
              <div className="pb-16 md:pb-0">
                <Footer />
              </div>
              {CURRENT_EFFECT !== 'none' && <CurrentEffect />}
            </div>
          </LayoutWrapper>
        </Provider>
      </body>
    </html>
  );
}
