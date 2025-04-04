

import { NextResponse } from "next/server";
import Product from "@/models/productModel";
import connectDB from "@/config/connectDB";

export async function GET(req, context) {
  await connectDB(); 

  try {
    const params = context.params;
    const { slug } = params;

    const product = await Product.findOne({ slug })
      .select("-photo")
      .populate("category");

    if (!product) {
      console.log("❌ Product not found in database");
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Force Revalidate for Next.js Caching Issue
    return NextResponse.json(
      {
        success: true,
        message: "Single product fetched successfully",
        product,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0", // 🛑 No Caching
        },
      }
    );
  } catch (error) {
    console.error("❌ Error in fetching product:", error);
    return NextResponse.json(
      { success: false, message: "Error in fetching product", error: error.message },
      { status: 500 }
    );
  }
}
