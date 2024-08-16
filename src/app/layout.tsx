import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "./navbar";

const inter = Poppins({weight: "400", style:"normal", subsets: ["latin","latin-ext"]});

export const metadata: Metadata = {
  title: "Prior Your Priority",
  description: "Women shoes and bags",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}><Navbar /> {children}</body>
    </html>
  );
}
