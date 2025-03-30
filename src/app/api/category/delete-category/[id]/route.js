import { NextResponse } from "next/server";
import Category from "@/models/categoryModel";
import connectDB from "@/config/connectDB";
import { authMiddleware, adminMiddleware } from "@/middlewares/authMiddleware";

export async function DELETE(req, { params }) {
  await connectDB(); // ✅ MongoDB से कनेक्ट करें

  try {
    // ✅ Authentication Middleware लागू करें
    const user = await authMiddleware(req);

    // ✅ सिर्फ़ एडमिन को Delete की अनुमति दें
    if (!adminMiddleware(user)) {
      return NextResponse.json(
        { success: false, message: "Access Denied: Admins only" },
        { status: 403 }
      );
    }

    const { id } = params; // ✅ URL Params से ID प्राप्त करें

    // ✅ पहले चेक करें कि कैटेगरी मौजूद है या नहीं
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // ✅ अगर कैटेगरी मिल गई तो उसे डिलीट करें
    await Category.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: "Category Deleted Successfully",
    });
  } catch (error) {
    console.error("Error in deleting category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error deleting category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
