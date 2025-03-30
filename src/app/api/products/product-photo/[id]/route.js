
import dbConnect from "@/config/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    await dbConnect();

    // ✅ `params` को await करें
    const { id } = await context.params;

    if (!id) {
      console.error("❌ Invalid Product ID:", id);
      return NextResponse.json(
        { success: false, message: "Invalid Product ID" },
        { status: 400 }
      );
    }

    // ✅ MongoDB से Product खोजें
    const product = await Product.findById(id).select("photo");
    if (!product || !product.photo || !product.photo.data) {
      console.error("❌ Photo Not Found for ID:", id);
      return NextResponse.json(
        { success: false, message: "Photo not found" },
        { status: 404 }
      );
    }

    return new Response(product.photo.data, {
      headers: {
        "Content-Type": product.photo.contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error fetching product photo:", error);
    return NextResponse.json(
      { success: false, message: "Error fetching photo", error: error.message },
      { status: 500 }
    );
  }
}
