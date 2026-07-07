// Courier provider configuration
// Contains branding, colors, and tracking information for each courier provider

export interface CourierProviderConfig {
  id: string;
  name: string;
  displayName: string;
  colors: {
    primary: string;
    secondary: string;
    dark: string;
    light: string;
    gradient: string;
  };
  icon: string;
  trackingUrlTemplate: string;
  trackingUrlPlaceholder?: string;
  website: string;
  logoUrl?: string;
}

export const COURIER_PROVIDERS: Record<string, CourierProviderConfig> = {
  pathao: {
    id: "pathao",
    name: "pathao",
    displayName: "Pathao",
    colors: {
      primary: "#2AA326",
      secondary: "#F7931E",
      dark: "#1B7A1C",
      light: "#E8F5E9",
      gradient: "linear-gradient(135deg, #2AA326 0%, #1B7A1C 100%)",
    },
    icon: "pathao",
    trackingUrlTemplate:
      "https://merchant.pathao.com/tracking?consignment_id={consignmentId}&phone={phone}",
    website: "https://pathao.com",
    logoUrl: "https://logosandtypes.com/wp-content/uploads/2025/04/Pathao.png",
  },
  steadfast: {
    id: "steadfast",
    name: "steadfast",
    displayName: "Steadfast",
    colors: {
      primary: "#1E88E5",
      secondary: "#FF6B00",
      dark: "#1565C0",
      light: "#E3F2FD",
      gradient: "linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)",
    },
    icon: "steadfast",
    trackingUrlTemplate: "https://steadfast.com.bd/t/{consignmentId}",
    website: "https://steadfast.com.bd",
    logoUrl:
      "https://play-lh.googleusercontent.com/OQgYiwAh2d4VqZgjf0GxZM83ylNIzxOQ-Wctx_MXmrxuaSA67UeYYwVhQ2PEMBxd0hs0nxnsRvnsviPRDgWgoGU",
  },
  carrybee: {
    id: "carrybee",
    name: "carrybee",
    displayName: "Carrybee",
    colors: {
      primary: "#6C5CE7",
      secondary: "#00B894",
      dark: "#5A4BC4",
      light: "#EDE9F6",
      gradient: "linear-gradient(135deg, #6C5CE7 0%, #5A4BC4 100%)",
    },
    icon: "carrybee",
    trackingUrlTemplate:
      "https://merchant.carrybee.com/order-track/{consignmentId}",
    website: "https://carrybee.com",
    logoUrl:
      "https://play-lh.googleusercontent.com/TAPaAULv7Wk2icMdCCGKU6Zsd6tN6zQ1a9VDA4ylKdhl_tASScGVvvCXjLU0Wl8qPlEM49a6s5IbR1l-yCCc",
  },
};

export const DEFAULT_PROVIDER: CourierProviderConfig = {
  id: "default",
  name: "default",
  displayName: "Courier",
  colors: {
    primary: "#64748B",
    secondary: "#94A3B8",
    dark: "#475569",
    light: "#F1F5F9",
    gradient: "linear-gradient(135deg, #64748B 0%, #475569 100%)",
  },
  icon: "truck",
  trackingUrlTemplate: "",
  website: "",
};

/**
 * Get provider configuration by provider name (case-insensitive)
 */
export function getProviderConfig(
  providerName: string | null | undefined,
): CourierProviderConfig {
  if (!providerName) return DEFAULT_PROVIDER;

  const normalized = providerName.toLowerCase();

  // Check for partial matches (e.g., "steadfast couriers" should match "steadfast")
  for (const [key, config] of Object.entries(COURIER_PROVIDERS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return config;
    }
  }

  return DEFAULT_PROVIDER;
}

/**
 * Generate tracking URL for a provider
 */
export function getTrackingUrl(
  providerName: string | null | undefined,
  consignmentId?: string | null,
  trackingCode?: string | null,
  phoneNumber?: string | null,
): string | null {
  const config = getProviderConfig(providerName);
  if (!config.trackingUrlTemplate) return null;

  let url = config.trackingUrlTemplate;

  if (consignmentId) {
    url = url.replace("{consignmentId}", consignmentId);
  }
  if (trackingCode) {
    url = url.replace("{trackingCode}", trackingCode);
  }
  if (phoneNumber) {
    url = url.replace("{phone}", phoneNumber);
  }

  return url;
}

/**
 * Get provider icon SVG
 */
export function getProviderIcon(
  providerName: string | null | undefined,
): string {
  const config = getProviderConfig(providerName);
  return config.icon;
}
