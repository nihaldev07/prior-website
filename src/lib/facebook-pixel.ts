/**
 * Facebook Pixel Tracking Utility
 * Provides helper functions for tracking Facebook Pixel events
 *
 * Each event generates a unique event_id for CAPI deduplication.
 * The same event_id is sent via Pixel (client) and CAPI (server)
 * so Meta counts each event only once.
 */

function generateEventId(): string {
  return crypto.randomUUID();
}

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
    if (!window.fbq) {
      const fbq: any = function () {
        // @ts-ignore
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = "2.0";
      fbq.queue = [];
      window.fbq = fbq;
    }

    window.fbq!("init", process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
    window.fbq!("track", "PageView");
  }
};

// Track Page View
export const trackPageView = () => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq("track", "PageView");
  }
};

// Track ViewContent event
export const trackViewContent = (product: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    const event_id = generateEventId();
    window.fbq("track", "ViewContent", {
      content_name: product?.name,
      content_ids: [product?.id],
      content_type: "product",
      value: product?.unitPrice || product?.price || 0,
      currency: "BDT",
    }, { event_id });
    return event_id;
  }
  return undefined;
};

// Track AddToCart event
export const trackAddToCart = (item: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    const event_id = generateEventId();
    window.fbq("track", "AddToCart", {
      content_name: item?.name,
      content_ids: [item?.id],
      content_type: "product",
      value: item?.unitPrice || item?.price || 0,
      currency: "BDT",
    }, { event_id });
    return event_id;
  }
  return undefined;
};

// Track InitiateCheckout event
export const trackInitiateCheckout = (cart: any[], totalValue: number, coupon?: string) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    const event_id = generateEventId();
    window.fbq("track", "InitiateCheckout", {
      content_ids: cart.map((item) => item?.id),
      content_type: "product",
      value: totalValue || 0,
      currency: "BDT",
      coupon: coupon || "",
    }, { event_id });
    return event_id;
  }
  return undefined;
};

// Track Purchase event
export const trackPurchase = (order: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    const event_id = generateEventId();
    window.fbq("track", "Purchase", {
      content_ids: order?.items?.map((item: any) => item?.item_id) || [],
      content_type: "product",
      value: order?.value || order?.totalPrice || 0,
      currency: order?.currency || "BDT",
      transaction_id: order?.transaction_id || order?.orderNumber || "",
      coupon: order?.coupon || "",
    }, { event_id });
    return event_id;
  }
  return undefined;
};

// Track Search event
export const trackSearch = (searchString: string, resultsCount?: number) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq("track", "Search", {
      search_string: searchString,
      content_ids: [],
      content_type: "product",
    });
  }
};

// Track CompleteRegistration event
export const trackCompleteRegistration = () => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    const event_id = generateEventId();
    window.fbq("track", "CompleteRegistration", {
      content_name: "User Registration",
      status: "completed",
    }, { event_id });
    return event_id;
  }
  return undefined;
};

// Track Lead event
export const trackLead = (leadType?: string) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq("track", "Lead", {
      content_type: leadType || "contact_form",
      content_name: leadType || "Contact Form Submission",
    });
  }
};

// Track custom event
export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq("trackCustom", eventName, parameters);
  }
};
