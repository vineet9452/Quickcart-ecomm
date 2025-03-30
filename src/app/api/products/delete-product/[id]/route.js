import { NextResponse } from "next/server";
import Product from "@/models/productModel";
import connectDB from "@/config/connectDB";

export async function DELETE(req, { params }) {
  await connectDB(); // ✅ MongoDB से कनेक्ट करें

  try {
    // ✅ प्रोडक्ट को ID से खोजकर डिलीट करें
    const product = await Product.findByIdAndDelete(params.id);

    // यदि प्रोडक्ट नहीं मिला
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleting product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in deleting product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
