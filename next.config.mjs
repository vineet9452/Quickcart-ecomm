const nextConfig = {
  images: {
    domains: ["yourproject.vercel.app", "yourdomain.com", "res.cloudinary.com"], // ✅ अपनी Production Domain डालें
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yourproject.vercel.app", // ✅ Vercel Domain डालें
        pathname: "/api/products/product-photo/**",
      },
    ],
    unoptimized: false, // ✅ Optimize रखें (Vercel बेहतर Performance देगा)
  },
  reactStrictMode: true, // ✅ Strict Mode Enable करें (Production में अच्छा होता है)

  // ✅ Production Build में console.log() हटाएं
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
};

export default nextConfig;
