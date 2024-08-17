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
        hostname: "res.cloudinary.com",
        port: "",
      },
    ],
  },
  async rewrites() {
    return [
      // {
      //   source: "/",
      //   destination: "/home",
      // },
    ];
  },
};

export default nextConfig;
