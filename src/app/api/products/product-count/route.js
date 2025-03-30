import dbConnect  from "@/config/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

// ✅ GET PRODUCT COUNT
export async function GET() {
  await dbConnect(); // MongoDB से कनेक्ट करें

  try {
    const total = await Product.countDocuments(); // कुल उत्पादों की संख्या गिनें

    return NextResponse.json(
      {
        success: true,
        total,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Product Count Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in fetching product count",
        error: error.message,
      },
      { status: 400 }
    );
  }
}
