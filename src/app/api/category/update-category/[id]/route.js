
import { authMiddleware, adminMiddleware } from "@/middlewares/authMiddleware";
import categoryModel from "@/models/categoryModel";
import slugify from "slugify";
import { NextResponse } from "next/server";

// ✅ PUT Request Handler
export async function PUT(req, { params }) {
  try {

    // 🔹 Authentication Middleware Call
    const authResult = await authMiddleware(req);
    if (authResult.error) return authResult.response; // अगर authentication fail है

    // 🔹 Check Admin Role
    const adminResult = adminMiddleware(authResult.user);
    if (adminResult.error) return adminResult.response; // अगर user admin नहीं है

    const { id } = params; // ✅ URL Params से ID लें
    const { name } = await req.json(); // ✅ Body से Name लें

    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    const category = await categoryModel.findByIdAndUpdate(
      id,
      { name, slug: slugify(name, { lower: true }) },
      { new: true }
    );

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    console.error("❌ Error Updating Category:", error.message);
    return NextResponse.json(
      {
        success: false,
        message: "Error updating category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
