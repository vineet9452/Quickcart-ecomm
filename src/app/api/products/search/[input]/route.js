
import dbConnect from "@/config/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

// ✅ SEARCH PRODUCT API (Dynamic Route)
export async function GET(req, context) {
  await dbConnect(); // ✅ MongoDB से कनेक्ट करें

  try {
    // ✅ Ensure `context.params.input` is a valid string
    const keyword =
      typeof context.params.input === "string"
        ? context.params.input.trim()
        : "";

    if (!keyword) {
      return NextResponse.json(
        { success: false, message: "Keyword is required" },
        { status: 400 }
      );
    }


    // ✅ MongoDB Search Query
    const results = await Product.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ],
    }).select("-photo");

    return NextResponse.json({ success: true, results }, { status: 200 });
  } catch (error) {
    console.error("❌ Search API Error:", error); // 🛑 Debugging
    return NextResponse.json(
      {
        success: false,
        message: "Internal Server Error in Search API",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
