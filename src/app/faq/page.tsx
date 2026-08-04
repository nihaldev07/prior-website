import type { Metadata } from "next";
import FAQContent from "./FAQContent";

export const metadata: Metadata = {
  title: "FAQ - Prior | Your Priority in Fashion",
  description:
    "Find answers to frequently asked questions about orders, payments, shipping, returns, and more at Prior.",
  openGraph: {
    title: "FAQ - Prior",
    description:
      "Find answers to frequently asked questions about orders, payments, shipping, returns, and more.",
    url: "https://priorbd.com/faq",
  },
};

const FAQPage = () => {
  return <FAQContent />;
};

export default FAQPage;
