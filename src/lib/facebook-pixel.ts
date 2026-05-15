/**
 * Facebook Pixel Tracking Utility
 * Provides helper functions for tracking Facebook Pixel events
 */

// Initialize Facebook Pixel
export const initFacebookPixel = () => {
  if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID) {
    // Initialize fbq if it doesn't exist
    if (!window.fbq) {
      const fbq: any = function () {
        // @ts-ignore - fbq is being defined here
        fbq.callMethod ? fbq.callMethod.apply(fbq, arguments) : fbq.queue.push(arguments);
      };
      fbq.push = fbq;
      fbq.loaded = true;
      fbq.version = '2.0';
      fbq.queue = [];
      window.fbq = fbq;
    }

    // Initialize Facebook Pixel
    // fbq is guaranteed to be defined here because we just created it or it already existed
    window.fbq!('init', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
    window.fbq!('track', 'PageView');

    console.log('[Facebook Pixel] Initialized with ID:', process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID);
  } else {
    console.warn('[Facebook Pixel] Not initialized: NEXT_PUBLIC_FACEBOOK_PIXEL_ID not found or not on client');
  }
};

// Track Page View
export const trackPageView = () => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'PageView');
    console.log('[Facebook Pixel] PageView tracked');
  }
};

// Track ViewContent event
export const trackViewContent = (product: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'ViewContent', {
      content_name: product?.name,
      content_ids: [product?.id],
      content_type: 'product',
      value: product?.unitPrice || product?.price || 0,
      currency: 'BDT',
    });
    console.log('[Facebook Pixel] ViewContent tracked for:', product?.name);
  }
};

// Track AddToCart event
export const trackAddToCart = (item: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'AddToCart', {
      content_name: item?.name,
      content_ids: [item?.id],
      content_type: 'product',
      value: item?.unitPrice || item?.price || 0,
      currency: 'BDT',
    });
    console.log('[Facebook Pixel] AddToCart tracked for:', item?.name);
  }
};

// Track InitiateCheckout event
export const trackInitiateCheckout = (cart: any[], totalValue: number, coupon?: string) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'InitiateCheckout', {
      content_ids: cart.map(item => item?.id),
      content_type: 'product',
      value: totalValue || 0,
      currency: 'BDT',
      coupon: coupon || '',
    });
    console.log('[Facebook Pixel] InitiateCheckout tracked');
  }
};

// Track Purchase event
export const trackPurchase = (order: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'Purchase', {
      content_ids: order?.items?.map((item: any) => item?.item_id) || [],
      content_type: 'product',
      value: order?.value || order?.totalPrice || 0,
      currency: order?.currency || 'BDT',
      transaction_id: order?.transaction_id || order?.orderNumber || '',
      coupon: order?.coupon || '',
    });
    console.log('[Facebook Pixel] Purchase tracked for order:', order?.transaction_id || order?.orderNumber);
  }
};

// Track Search event
export const trackSearch = (searchString: string, resultsCount?: number) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'Search', {
      search_string: searchString,
      content_ids: [],
      content_type: 'product',
    });
    console.log('[Facebook Pixel] Search tracked for:', searchString);
  }
};

// Track CompleteRegistration event
export const trackCompleteRegistration = () => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'CompleteRegistration', {
      content_name: 'User Registration',
      status: 'completed',
    });
    console.log('[Facebook Pixel] CompleteRegistration tracked');
  }
};

// Track Lead event
export const trackLead = (leadType?: string) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('track', 'Lead', {
      content_type: leadType || 'contact_form',
      content_name: leadType || 'Contact Form Submission',
    });
    console.log('[Facebook Pixel] Lead tracked for:', leadType);
  }
};

// Track custom event
export const trackCustomEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== "undefined" && typeof window.fbq !== "undefined") {
    window.fbq('trackCustom', eventName, parameters);
    console.log('[Facebook Pixel] Custom event tracked:', eventName, parameters);
  }
};
