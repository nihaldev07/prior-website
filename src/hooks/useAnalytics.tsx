// useAnalytics.js
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
        console.log("Analytics instance:", analytics); // Log for debugging
        if (analytics) {
          logEvent(analytics, "page_view", { page_path: pathname });
        }
      } catch (error) {
        console.error("Error logging page view:", error);
      }
    };

    logPageView();
  }, [pathname]);
};

export default useAnalytics;
