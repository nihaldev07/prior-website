import type { Metadata } from "next";
import { Alegreya, DM_Serif_Text, Lobster_Two } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "./navbar";
import Footer from "@/shared/Footer/Footer";
// import Maintenance from "./Maintainance";
import { PageStateProvider } from "@/context/PageStateContext";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";

// Alegreya for body text and descriptions
const alegreya = Alegreya({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-alegreya",
});

// Oswald for headings and numbers
const oswald = DM_Serif_Text({
  weight: "400",
  style: "normal",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-oswald",
});

const lobster = Lobster_Two({
  weight: "400",
  style: ["normal"],
  subsets: ["latin"],
  display: "swap",
  preload: true,
  variable: "--font-lobster",
});

export const metadata: Metadata = {
  title: "Women's Shoes and Bags | Prior - Your Priority in Fashion",
  description:
    "Discover Prior's latest collection of women's shoes and bags, where style meets sophistication. Elevate your fashion game with our trendy footwear and handbags designed to make you stand out. Prioritize your style effortlessly with Prior - your ultimate destination for fashion-forward accessories.",
  icons: [
    {
      rel: "apple-touch-icon",
      url: "/apple-touch-icon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      url: "/favicon.png",
    },
    {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      url: "/favicon.png",
    },
    {
      rel: "icon",
      url: "/favicons.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //useAnalytics();
  return (
    <html lang='en'>
      <head>
        {/* Preconnect to external domains for faster resource loading */}
        <link
          rel='preconnect'
          href='https://d38c45qguy2pwg.cloudfront.net'
          crossOrigin='anonymous'
        />
        <link
          rel='preconnect'
          href='https://res.cloudinary.com'
          crossOrigin='anonymous'
        />
        <link
          rel='preconnect'
          href='https://prior-image.s3.eu-north-1.amazonaws.com'
          crossOrigin='anonymous'
        />

        {/* <link rel='dns-prefetch' href='https://cdn.socket.io' />

        <link rel='dns-prefetch' href='https://yuki.priorbd.com' />
        <link rel='dns-prefetch' href='https://app.priorbd.com' /> */}
        <link rel='dns-prefetch' href='https://www.googletagmanager.com' />

        {/* Google Tag Manager - changed to lazyOnload for better initial performance */}
        <Script
          id='google-tag-manager'
          strategy='lazyOnload'
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-T2HZLQ22');
            `,
          }}
        />

        {/* Chat Widget Scripts - Load after page is interactive */}
        {/* <Script
          src='https://cdn.socket.io/4.7.2/socket.io.min.js'
          strategy='lazyOnload'
        />

        <Script
          src='https://app.priorbd.com/widget/yuki-widget.js'
          data-socket-url='https://yuki.priorbd.com'
          data-position='bottom-right'
          strategy='lazyOnload'
        /> */}
      </head>
      <body
        className={`${alegreya.variable} ${oswald.variable} ${lobster.variable}`}>
        {/* Google Tag Manager - noscript fallback */}
        <noscript>
          <iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-T2HZLQ22'
            height='0'
            width='0'
            style={{ display: "none", visibility: "hidden" }}></iframe>
        </noscript>
        <PageStateProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <>
                  <Navbar />
                  {children}
                  <Footer />
                </>
                {/* <Maintenance /> */}
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </PageStateProvider>
        <Toaster position='top-center' />
      </body>
    </html>
  );
}
