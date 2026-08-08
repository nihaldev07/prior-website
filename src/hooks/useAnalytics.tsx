"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "@/lib/firebase";

const useAnalytics = () => {
  const pathname = usePathname();

  useEffect(() => {
    const logPageView = async () => {
      try {
        const analytics = await getAnalyticsInstance();
        if (analytics) {
          logEvent(analytics, "page_view", { page_path: pathname });
        }
      } catch (error) {
        console.error("Error logging page view:", error);
      }

      if (typeof window !== "undefined" && window.dataLayer) {
        window.dataLayer.push({
          event: "page_view",
          eventModel: {
            page_path: pathname,
            send_to: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
          },
        });
      }
    };

    logPageView();
  }, [pathname]);
};

export default useAnalytics;
