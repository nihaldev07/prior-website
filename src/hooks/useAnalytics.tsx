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
      const analytics = await getAnalyticsInstance();
      if (analytics) {
        logEvent(analytics, "page_view", { page_path: pathname });
      }
    };

    logPageView();
  }, [pathname]);
};

export default useAnalytics;
