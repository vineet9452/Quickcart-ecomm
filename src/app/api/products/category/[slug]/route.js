
import dbConnect from "@/config/connectDB"; // ✅ सही import
import Product from "@/models/productModel";
import Category from "@/models/categoryModel";
import { NextResponse } from "next/server";

// ✅ GET CATEGORY PRODUCTS API
export async function GET(req, context) {
  try {
    await dbConnect(); // ✅ MongoDB से कनेक्ट करें

    const { slug } = await context.params; // ✅ सही तरीक़ा

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "Slug is required" },
        { status: 400 }
      );
    }

    // 🔍 कैटेगरी खोजें
    const category = await Category.findOne({ slug });

    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    // उस कैटेगरी के सभी प्रोडक्ट्स खोजें
    const products = await Product.find({ category: category._id }).populate(
      "category"
    );

    return NextResponse.json(
      { success: true, category, products },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error while fetching products by category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while getting products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
