
import connectDB  from "@/config/connectDB"; // ✅ DB कनेक्शन फ़ाइल इम्पोर्ट करें
import categoryModel from "@/models/categoryModel";
import { NextResponse } from "next/server";

// ✅ Get All Categories API
export async function GET() {
  try {
    await connectDB(); // ✅ MongoDB से कनेक्ट करें

    // 🔹 MongoDB से सभी कैटेगरी प्राप्त करें
    const categories = await categoryModel.find({}).sort({ createdAt: -1 });

    // 🔹 अगर कोई कैटेगरी नहीं मिली
    if (categories.length === 0) {
      return NextResponse.json(
        { success: false, message: "No categories found" },
        { status: 404 }
      );
    }

    // 🔹 सफल रिस्पॉन्स
    return NextResponse.json({
      success: true,
      message: "All categories list",
      categories,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching categories",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
