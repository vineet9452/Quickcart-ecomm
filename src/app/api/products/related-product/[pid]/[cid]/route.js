import dbConnect from "@/config/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  await dbConnect();

  try {
    const { pid, cid } = await context.params; // ✅ सही तरीका

    if (!pid || !cid) {
      return NextResponse.json(
        { success: false, message: "Product ID and Category ID are required" },
        { status: 400 }
      );
    }

    // ✅ Find related products in the same category
    const relatedProducts = await Product.find({
      category: cid,
      _id: { $ne: pid }, // Exclude current product
    }).select("-photo"); // Exclude photo data for performance

    return NextResponse.json(
      { success: true, products: relatedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching related products:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching related products",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
