import type { Metadata } from "next";
import PaymentContent from "./PaymentContent";

export const metadata: Metadata = {
  title: "Payment Methods - Prior | Your Priority in Fashion",
  description:
    "Learn about our secure payment methods including Cash on Delivery (COD) and bKash at Prior.",
  openGraph: {
    title: "Payment Methods - Prior",
    description:
      "Secure payment options: Cash on Delivery and bKash available across Bangladesh.",
    url: "https://priorbd.com/payments",
  },
};

const PaymentsPage = () => {
  return <PaymentContent />;
};

export default PaymentsPage;
