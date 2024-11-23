import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Navbar from "./navbar";
import Footer from "@/shared/Footer/Footer";
import Maintenance from "./Maintainance";

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
      <body className={inter.className}>
        <CartProvider>
          {/* <>
            <Navbar />
            {children}
            <Footer />
          </> */}
          <Maintenance />
        </CartProvider>
      </body>
    </html>
  );
}
