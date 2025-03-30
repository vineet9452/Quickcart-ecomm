

import { authMiddleware, adminMiddleware } from "@/middlewares/authMiddleware";
import categoryModel from "@/models/categoryModel";
import slugify from "slugify";
import { NextResponse } from "next/server";

// ✅ Create New Category API (Admin Only)
export async function POST(req) {
  try {
    // 🔹 Authentication Check
    const authCheck = await authMiddleware(req);
    if (authCheck.error) return authCheck.response;

    const user = authCheck.user;

    // 🔹 Admin Check
    const adminCheck = adminMiddleware(user);
    if (adminCheck.error) return adminCheck.response;

    // 🔹 Get Category Name from Request
    const { name } = await req.json();
    if (!name) {
      return NextResponse.json(
        { success: false, message: "Name is required" },
        { status: 400 }
      );
    }

    // 🔹 Check if Category Already Exists
    const existingCategory = await categoryModel.findOne({ name });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, message: "Category Already Exists" },
        { status: 400 }
      );
    }

    // 🔹 Create New Category
    const category = await new categoryModel({
      name,
      slug: slugify(name, { lower: true }),
    }).save();

    return NextResponse.json({
      success: true,
      message: "New category created successfully",
      category,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "Error creating category",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
