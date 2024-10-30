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
    deviceSizes: [320, 420, 768, 1024, 1200], // Device sizes for responsive image optimization
  },
  swcMinify: true, // Use SWC for minification
  reactStrictMode: true, // Enable React strict mode for better error detection in development

  headers: async () => [
    {
      source: "/(.*)", // Apply headers to all routes
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable", // Cache assets for 1 year
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
