import { authMiddleware } from "@/middleware/authMiddleware";
import { NextResponse } from "next/server";

// ✅ Protected Test Route
export async function GET(req) {
  const user = authMiddleware(req);
  if (!user)
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  return NextResponse.json({
    message: "Protected Route Accessed Successfully!",
    user,
  });
}
