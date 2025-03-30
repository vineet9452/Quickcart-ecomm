
import { NextResponse } from "next/server";
import orderModel from "@/models/orderModel";
import productModel from "@/models/productModel"; // ✅ Product Model जोड़ें
import { authMiddleware } from "../../../../middlewares/authMiddleware";
import connectDB from "@/config/connectDB";

export async function GET(req) {
  try {
    await connectDB(); // ✅ MongoDB से कनेक्ट करें

    // ✅ Authentication Middleware से यूजर Validate करें
    const { error, user, response } = await authMiddleware(req);
    if (error) return response;

    // ✅ केवल Admin (role = 1) ही ऑर्डर्स देख सकता है
    if (user.role !== 1) {
      return NextResponse.json(
        { success: false, message: "Access Denied: Admin Only" },
        { status: 403 }
      );
    }

    // ✅ Orders को Properly Populate करें (Products की पूरी डिटेल लाएं)
    const orders = await orderModel
      .find({})
      .populate({
        path: "products.product", // ✅ Correctly Populate Products
        model: productModel,
        select: "name price photo", // ✅ Photo Field Include करें
      })
      .populate("buyer", "name email") // ✅ Buyer की Details लाएं
      .sort({ createdAt: -1 });
    return NextResponse.json({
      success: true,
      message: "All Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("❌ Error while fetching orders:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while getting orders",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
