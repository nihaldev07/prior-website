import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "./navbar";
import Footer from "@/shared/Footer/Footer";
// import Maintenance from "./Maintainance";
import { PageStateProvider } from "@/context/PageStateContext";
import Script from "next/script";

const inter = Poppins({
  weight: "400",
  style: "normal",
  subsets: ["latin", "latin-ext"],
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
    <html lang="en">
      <head>
        {/* Google Tag Manager - head script */}
        <Script
          id="google-tag-manager"
          strategy="beforeInteractive"
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
      </head>
      <body className={inter.className}>
        {/* Google Tag Manager - noscript fallback */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-T2HZLQ22"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
        <PageStateProvider>
          <CartProvider>
            <>
              <Navbar />
              {children}
              <Footer />
            </>
            {/* <Maintenance /> */}
          </CartProvider>
        </PageStateProvider>
      </body>
    </html>
  );
}
