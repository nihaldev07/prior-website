import type { Metadata } from "next";
import { DM_Serif_Text } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { WishlistProvider } from "@/context/WishlistContext";
import Navbar from "./navbar";
import Footer from "@/shared/Footer/Footer";
// import Maintenance from "./Maintainance";
import { PageStateProvider } from "@/context/PageStateContext";
import Script from "next/script";

const inter = DM_Serif_Text({
  weight: "400", // Only one weight available
  style: "normal", // Or 'italic' if needed
  subsets: ["latin"], // Or ['latin', 'latin-ext'] if needed
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
        {/* Chat Widget Script */}

        <Script src='https://cdn.socket.io/4.7.2/socket.io.min.js' />

        <Script
          src='widget/enhanced-chat-widget.js'
          data-socket-url='https://yuki.priorbd.com'
          data-position='bottom-right'
        />

        {/* Custom Analytics Script */}
        {/* <Script
          id='yuki-analytics'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              const originalConsoleLog = console.log;
              console.log = (...args) => {
                if (args[0] === "Yuki Chat Widget Event:") {
                  const eventName = args[1];
                  if (typeof gtag !== "undefined") {
                    gtag("event", eventName, {
                      event_category: "yuki_chat_widget",
                      company: "yuki"
                    });
                  }
                }
                originalConsoleLog.apply(console, args);
              };
            `,
          }}
        /> */}
        {/* Google Tag Manager - head script */}
        <Script
          id='google-tag-manager'
          strategy='beforeInteractive'
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
      </body>
    </html>
  );
}
