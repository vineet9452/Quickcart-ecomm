

import { NextResponse } from "next/server";
import Product from "@/models/productModel";
import connectDB from "@/config/connectDB";

export async function GET(req, context) {
  await connectDB(); // ✅ MongoDB कनेक्ट करें

  try {
    // ✅ `await` से `params` को अनव्रैप करें
    const params = await context.params;
    const { slug } = params;

    // ✅ Slug से प्रोडक्ट खोजें और कैटेगरी को पॉपुलेट करें
    const product = await Product.findOne({ slug })
      .select("-photo")
      .populate("category");

    // अगर प्रोडक्ट नहीं मिला
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ Response में प्रोडक्ट भेजें
    return NextResponse.json({
      success: true,
      message: "Single product fetched successfully",
      product,
    });
  } catch (error) {
    console.error("Error in fetching product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
