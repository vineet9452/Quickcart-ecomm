import dbConnect from "@/config/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

// ✅ GET ALL PRODUCTS
export async function GET() {
  await dbConnect(); // MongoDB से कनेक्ट करें

  try {
    const products = await Product.find({})
      .populate("category")
      .select("-photo") // फोटो को exclude करें
      .limit(10)
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      totalCount: products.length,
      message: "All Products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Get Products Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
