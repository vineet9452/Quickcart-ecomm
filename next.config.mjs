const nextConfig = {
  images: {
    domains: ["localhost", "127.0.0.1"],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
        pathname: "/api/products/product-photo/**",
      },
    ],
    unoptimized: true,
  },
  reactStrictMode: false, // ✅ Strict Mode Disable करें
};
