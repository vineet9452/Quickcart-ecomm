"use client";

import UserPrivate from "@/app/components/Routes/UserPrivate";

export default function UserLayout({ children }) {
  return <UserPrivate>{children}</UserPrivate>;
}
