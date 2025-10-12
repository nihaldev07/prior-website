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
        hostname: "d38c45qguy2pwg.cloudfront.net",
        port: "",
      },
    ],
    deviceSizes: [320, 420, 768, 1024, 1200],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
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
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-accordion",
      "@radix-ui/react-select",
      "@radix-ui/react-tabs",
      "@radix-ui/react-tooltip",
      "framer-motion",
      "firebase",
      "axios",
      "sweetalert2",
    ],
    webpackBuildWorker: true, // Enable parallel builds
  },
  headers: async () => [
    {
      source: "/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/_next/static/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
        },
      ],
    },
    {
      source: "/:path*",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=0, must-revalidate",
        },
      ],
    },
  ],
  async rewrites() {
    return [
      // Add rewrites if needed
    ];
  },
};

export default nextConfig;
