/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/emerging-it/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/deajqyzno/**",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/home",
      },
    ];
  },
};

export default nextConfig;
