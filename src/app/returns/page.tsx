import type { Metadata } from "next";
import ReturnsContent from "./ReturnsContent";

export const metadata: Metadata = {
  title: "Returns & Exchange - Prior | Your Priority in Fashion",
  description:
    "Learn about our hassle-free return and exchange policy at Prior. 3-step process for returns, exchanges, and refunds.",
  openGraph: {
    title: "Returns & Exchange - Prior",
    description:
      "Hassle-free returns and exchanges within 3 days of purchase.",
    url: "https://priorbd.com/returns",
  },
};

const ReturnsPage = () => {
  return <ReturnsContent />;
};

export default ReturnsPage;
