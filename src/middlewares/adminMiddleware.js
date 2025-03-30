import { authMiddleware } from "@/middlewares/authMiddleware";
import { NextResponse } from "next/server";

export const adminMiddleware = async (req) => {
  const authCheck = await authMiddleware(req);
  if (!authCheck.success) return authCheck;

  const user = authCheck.user;

  // 🔴 अगर role = 1 नहीं है, तो इसे एक्सेस ना करने दें
  if (user.role !== 1) {
    return {
      success: false,
      response: NextResponse.json(
        { message: "Access Denied! Admins Only." },
        { status: 403 }
      ),
    };
  }

  return { success: true, user };
};
