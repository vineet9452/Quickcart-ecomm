"use client"; // ✅ Client Component

import { useEffect } from "react";

const BootstrapClient = () => {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js"); // ✅ Client-Side में लोड करें
  }, []);

  return null; // यह कोई UI नहीं दिखाएगा, सिर्फ JS लोड करेगा
};

export default BootstrapClient;
