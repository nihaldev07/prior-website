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
  },
  swcMinify: true,
  reactStrictMode: true,
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "Cache-Control",
          value: "public, max-age=31536000, immutable",
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
