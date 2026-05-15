// Global type declarations for third-party scripts and analytics

declare global {
  interface Window {
    // Facebook Pixel - Global fbq function
    // @see https://developers.facebook.com/docs/meta-pixel/reference
    fbq?: FacebookPixel.Function;

    // Google Tag Manager - Data Layer
    // @see https://developers.google.com/tag-manager/devguide
    dataLayer: any[];
  }
}

// Facebook Pixel type definitions
declare namespace FacebookPixel {
  interface Function {
    (...args: any[]): void;
    callMethod?: (...args: any[]) => void;
    queue?: any[];
    push?: (...args: any[]) => void;
    loaded?: boolean;
    version?: string;
  }
}

// Ensure this is treated as a module
export {};
