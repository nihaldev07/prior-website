/**
 * Unified Analytics Helper
 * Combines Firebase Analytics, Facebook Pixel, and GTM Data Layer tracking
 * All events are tracked across all platforms simultaneously
 */

import {
  trackPageView as fbTrackPageView,
  trackViewContent as fbTrackViewContent,
  trackAddToCart as fbTrackAddToCart,
  trackInitiateCheckout as fbTrackInitiateCheckout,
  trackPurchase as fbTrackPurchase,
  trackSearch as fbTrackSearch,
  trackCompleteRegistration as fbTrackCompleteRegistration,
  trackLead as fbTrackLead,
} from "./facebook-pixel";

// ============================================================================
// Page View Tracking
// ============================================================================

export const trackPageView = (pathname: string) => {
  // Firebase Analytics - PageView is tracked automatically by useAnalytics hook
  // No need to duplicate here

  // Facebook Pixel
  fbTrackPageView();

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "page_view",
      page_path: pathname,
      timestamp: new Date().getTime(),
    });
  }
};

// ============================================================================
// E-commerce Events
// ============================================================================

/**
 * Track ViewContent / view_item event
 */
export const trackViewContent = (product: any) => {
  const effectivePrice = !!product?.hasDiscount
    ? (product?.updatedPrice ?? product?.unitPrice)
    : product?.unitPrice || product?.price || 0;

  // Facebook Pixel
  fbTrackViewContent(product);

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "view_item",
      ecommerce: {
        items: [
          {
            item_id: product?.id,
            item_name: product?.name,
            item_brand: "Prior",
            item_category: product?.categoryName || "",
            price: effectivePrice,
            currency: "BDT",
          },
        ],
      },
    });
  }
};

/**
 * Track AddToCart event
 */
export const trackAddToCart = (item: any) => {
  const effectivePrice = !!item?.hasDiscount
    ? (item?.updatedPrice ?? item?.unitPrice)
    : item?.unitPrice || item?.price || 0;

  // Facebook Pixel
  fbTrackAddToCart(item);

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: [
          {
            item_id: item?.id,
            item_name: item?.name,
            item_brand: "Prior",
            item_category: item?.categoryName || "",
            price: effectivePrice,
            currency: "BDT",
            quantity: item?.quantity || 1,
          },
        ],
      },
    });
  }
};

/**
 * Track InitiateCheckout event
 */
export const trackBeginCheckout = (
  cart: any[],
  totalValue: number,
  coupon?: string,
) => {
  const mapItem = (product: any, index: number) => {
    const effectivePrice = !!product?.hasDiscount
      ? (product?.updatedPrice ?? product?.unitPrice)
      : product?.unitPrice;
    return {
      item_id: product?.sku,
      item_name: product?.name,
      item_brand: "Prior",
      item_category: product?.categoryName ?? "",
      price: effectivePrice,
      quantity: product?.quantity,
    };
  };

  // Facebook Pixel
  fbTrackInitiateCheckout(cart, totalValue, coupon);

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "begin_checkout",
      ecommerce: {
        affiliation: "Web-Site",
        value: totalValue || 0,
        coupon: coupon || "",
        currency: "BDT",
        items: cart?.map((product, index) => ({
          ...mapItem(product, index),
          coupon: coupon || "",
          discount: product?.discount,
          index,
        })),
      },
    });
  }
};

/**
 * Track Purchase event
 */
export const trackPurchase = (order: any) => {
  console.log("🛒 trackPurchase called", order);

  // Facebook Pixel
  fbTrackPurchase(order);

  if (typeof window !== "undefined") {
    console.log("📦 dataLayer before:", window.dataLayer);

    window.dataLayer = window.dataLayer || [];

    window.dataLayer.push({
      event: "purchase",
      ecommerce: {
        transaction_id: order?.transaction_id || order?.orderNumber || "",
        affiliation: "Web-Site",
        value: order?.value || order?.totalPrice || 0,
        shipping: order?.shipping || 0,
        discount: order?.discount || 0,
        currency: order?.currency || "BDT",
        payment_type: order?.payment_type || "cod",
        items: order?.items || [],
      },
    });

    console.log("✅ purchase pushed", window.dataLayer);
  }
};

/**
 * Track Search event
 */
export const trackSearch = (searchString: string, resultsCount?: number) => {
  // Facebook Pixel
  fbTrackSearch(searchString, resultsCount);

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "search",
      search_term: searchString,
      results_count: resultsCount || 0,
    });
  }
};

// ============================================================================
// Lead & Registration Events
// ============================================================================

/**
 * Track CompleteRegistration event
 */
export const trackCompleteRegistration = () => {
  // Facebook Pixel
  fbTrackCompleteRegistration();

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "sign_up",
      method: "website",
    });
  }
};

/**
 * Track Lead event
 */
export const trackLead = (leadType?: string) => {
  // Facebook Pixel
  fbTrackLead(leadType);

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: "generate_lead",
      lead_type: leadType || "contact_form",
    });
  }
};

// ============================================================================
// Custom Event Tracking
// ============================================================================

/**
 * Track custom event across all platforms
 */
export const trackCustomEvent = (eventName: string, parameters?: any) => {
  // Facebook Pixel - Use trackCustom for non-standard events
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    // @ts-ignore
    window.fbq("trackCustom", eventName, parameters);
  }

  // GTM Data Layer
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...parameters,
    });
  }
};
