const nextConfig = {
  images: {
    domains: ["quickcart-ecomm.vercel.app"], // ✅ Vercel Domain Add करें
    remotePatterns: [
      {
        protocol: "https",
        hostname: "https://quickcart-ecomm.vercel.app",
        pathname: "/api/products/product-photo/**",
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
