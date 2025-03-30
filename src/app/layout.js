import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css"; // ✅ Global CSS
import "bootstrap/dist/css/bootstrap.min.css"; // ✅ Bootstrap CSS (Safe)
import Header from "@/app/components/Layout/Header";
import StoreProvider from "@/Redux/StoreProvider";
import Footer from "@/app/components/Layout/Footer";
import BootstrapClient from "@/app/components/BootstrapClient"; // ✅ Client-Side में JS लोड होगा
import { Toaster } from "react-hot-toast"; // ✅ Hot Toast Add किया गया

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "QuickCart - E-commerce",
  description: "Buy and sell products easily",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <BootstrapClient /> {/* ✅ Bootstrap JS अब Client-Side में लोड होगा */}
        <StoreProvider>
          <div className="layout">
            <Header />
            <main style={{ minHeight: "68vh" }}>{children}</main>
            <Footer />
          </div>
        </StoreProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            success: {
              style: {
                fontSize: "16px", // ✅ Smaller Text for Clean Look
                fontWeight: "600",
                padding: "20px",
                width: "400px", // ✅ Wider Toast like Sonner
                borderRadius: "12px",
                background: "#ffffff", // ✅ Pure White Background (Sonner Style)
                color: "#009933", // ✅ Green Success Text
                boxShadow: "0px 8px 30px rgba(0, 200, 81, 0.15)", // ✅ Soft Green Glow
                border: "1px solid rgba(0, 200, 81, 0.2)", // ✅ Subtle Green Border
                textAlign: "center",
              },
            },
            error: {
              style: {
                fontSize: "16px",
                fontWeight: "600",
                padding: "20px",
                width: "400px",
                borderRadius: "12px",
                background: "#ffffff",
                color: "#D32F2F", // 🔴 Rich Red Error Text
                boxShadow: "0px 8px 30px rgba(211, 47, 47, 0.15)", // 🔥 Light Red Glow
                border: "1px solid rgba(211, 47, 47, 0.2)", // 🔴 Subtle Red Border
                textAlign: "center",
              },
            },
            loading: {
              style: {
                fontSize: "16px",
                fontWeight: "600",
                padding: "20px",
                width: "400px",
                borderRadius: "12px",
                background: "#ffffff",
                color: "#FFA000", // 🟡 Rich Amber Loading Text
                boxShadow: "0px 8px 30px rgba(255, 160, 0, 0.15)", // 🌟 Soft Orange Glow
                border: "1px solid rgba(255, 160, 0, 0.2)", // 🟡 Subtle Orange Border
                textAlign: "center",
              },
            },
            style: {
              fontSize: "16px",
              fontWeight: "600",
              padding: "20px",
              width: "400px",
              borderRadius: "12px",
              background: "#ffffff",
              color: "#292929", // 🌑 Dark Text for Normal Toasts
              boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.1)", // 💡 Smooth & Elegant Shadow Effect
              border: "1px solid rgba(0, 0, 0, 0.1)", // Subtle Border
              textAlign: "center",
            },
          }}
        />
        {/* ✅ Toast Component */}
      </body>
    </html>
  );
}
