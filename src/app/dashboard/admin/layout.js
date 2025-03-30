"use client"; // ✅ अब यह Client Component बन गया

import { useSelector } from "react-redux";
import AdminPrivate from "../../../app/components/Routes/AdminPrivate";
import UserPrivate from "@/app/components/Routes/UserPrivate";
export default function DashboardLayout({ children }) {
  const { user } = useSelector((state) => state.auth); // ✅ अब कोई Error नहीं आएगा!


  if (user?.role === 1) {
    return (
      <AdminPrivate>
        {children}
      </AdminPrivate>
    );
  } else {
    return <UserPrivate>{children}</UserPrivate>;
  }
}
