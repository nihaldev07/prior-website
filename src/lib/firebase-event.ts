import { logEvent } from "firebase/analytics";
import { getAnalyticsInstance } from "@/lib/firebase";

export const trackEvent =async (eventName:string, eventParams:any) => {
        const analytics = await getAnalyticsInstance();
    if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
};
