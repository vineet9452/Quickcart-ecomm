

import dbConnect from "@/config/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

// ✅ GET PRODUCT LIST WITH PAGINATION
export async function GET(req, context) {
  await dbConnect(); // MongoDB से कनेक्ट करें

  try {
    const perPage = 6; // प्रति पेज कितने प्रोडक्ट्स दिखाने हैं
    const { page } = await context.params; // ✅ डायनामिक पेज नंबर प्राप्त करें
    const currentPage = parseInt(page) || 1;
    const products = await Product.find({})
      .select("-photo")
      .skip((currentPage - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const totalProducts = await Product.countDocuments();

    return NextResponse.json(
      {
        success: true,
        products,
        total: totalProducts,
        currentPage,
        totalPages: Math.ceil(totalProducts / perPage),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Pagination Error:", error);
    return NextResponse.json(
      { success: false, message: "Error in pagination", error: error.message },
      { status: 400 }
    );
  }
}
