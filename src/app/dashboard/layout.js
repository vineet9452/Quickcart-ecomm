
"use client";

import { useSelector } from "react-redux";

export default function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gray-100">
      {children} 
    </div>
  );
}
