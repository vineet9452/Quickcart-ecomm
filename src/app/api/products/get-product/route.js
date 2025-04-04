import { NextResponse } from "next/server";
import productModel from "@/models/productModel";
import connectDB from "@/config/connectDB";

export async function GET() {
  try {
     await connectDB(); // ✅ Must-have in serverless environments
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .sort({ createdAt: -1 })
      .limit(10);
    return NextResponse.json(
      {
        success: true,
        totalCount: products.length,
        message: "All Products fetched successfully",
        products,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
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
