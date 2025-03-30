import dbConnect from "@/config/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

// ✅ FILTER PRODUCTS
export async function POST(req) {
  await dbConnect(); // MongoDB से कनेक्ट करें

  try {
    const { checked, radio } = await req.json();
    let filters = {};

    // ✅ यदि कैटेगरी चेक की गई हो
    if (checked && checked.length > 0) {
      filters.category = { $in: checked };
    }

    // ✅ यदि प्राइस रेंज दी गई हो
    if (radio && radio.length === 2) {
      filters.price = { $gte: radio[0], $lte: radio[1] };
    }

    // ✅ प्रोडक्ट्स को फ़िल्टर करके लाएं
    const products = await Product.find(filters).select("-photo");

    return NextResponse.json(
      {
        success: true,
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Filter Products Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while filtering products",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
