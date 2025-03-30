
import jwt from "jsonwebtoken";
import User from "@/models/userModel"; // ✅ User Model इम्पोर्ट करें
import { NextResponse } from "next/server";
export const authMiddleware = async (req) => {
  try {
    const authHeader = req.headers.get("authorization") || "";

    if (!authHeader.startsWith("Bearer ")) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "Unauthorized! No Token Provided" },
          { status: 401 }
        ),
      };
    }

    const token = authHeader.split(" ")[1];

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "Invalid or Expired Token" },
          { status: 401 }
        ),
      };
    }

    // ✅ Database से User लाएँ
    const user = await User.findById(decoded._id).select("-password"); // 🎯 Password Exclude करें
    if (!user) {
      return {
        success: false,
        response: NextResponse.json(
          { message: "User Not Found or Deleted" },
          { status: 404 }
        ),
      };
    }

    return { success: true, user };
  } catch (error) {
    console.error("❌ Auth Middleware Error:", error);
    return {
      success: false,
      response: NextResponse.json(
        { message: "Authentication Error! Something went wrong." },
        { status: 500 }
      ),
    };
  }
};

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
