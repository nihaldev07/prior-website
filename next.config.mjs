import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "prior-image.s3.eu-north-1.amazonaws.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "app.priorbd.com",
        port: "",
        // FIX: restrict to /images/* so Next.js optimizer can't be abused
        // to proxy arbitrary paths on your Express backend
        pathname: "/images/**",
      },
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
  },
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  productionBrowserSourceMaps: false, // Disable source maps in production
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error", "warn"],
          }
        : false,
  },
  // Modularize imports for better tree-shaking
  modularizeImports: {
    "lucide-react": {
      transform: "lucide-react/dist/esm/icons/{{member}}",
    },
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-accordion",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "@radix-ui/react-popover",
      "@radix-ui/react-scroll-area",
      "@radix-ui/react-separator",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-label",
      "@radix-ui/react-hover-card",
      "@radix-ui/react-navigation-menu",
      "framer-motion",
      "firebase",
      "axios",
      "sweetalert2",
      "swiper",
      "embla-carousel-react",
      "react-hook-form",
      "zod",
    ],
    webpackBuildWorker: true, // Enable parallel builds
    isrMemoryCacheSize: 0,
  },
  // ─── HTTP Headers ─────────────────────────────────────────────────────────
  headers: async () => [
    // Next.js static assets are content-hashed — safe to cache forever
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    // Your /static folder (if any)
    {
      source: "/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    // API proxy routes — never cache
    {
      source: "/api/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "no-store",
        },
      ],
    },
    // All other pages — revalidate on every request (your existing behaviour)
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
        // Security headers — add these, they were missing
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "SAMEORIGIN" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      ],
    },
  ],
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://app.priorbd.com/:path*",
      },
    ];
  },
};

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
