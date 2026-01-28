"use client";

import { useEffect } from "react";
import Intercom from "@intercom/messenger-js-sdk";

export default function IntercomProvider() {
  useEffect(() => {
    // Only initialize Intercom on client side and in production
    if (typeof window !== "undefined") {
      Intercom({
        app_id: process.env.NEXT_PUBLIC_INTERCOM_APP_ID || "awl0i2x3",
      });
    }
  }, []);

  return null;
}
