
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/config/connectDB";
import { authMiddleware } from "@/middlewares/authMiddleware";
import orderModel from "@/models/orderModel";
import productModel from "@/models/productModel"; // ✅ Product Model इम्पोर्ट करें

export async function GET(req) {
  await connectDB(); // ✅ MongoDB से कनेक्ट करें

  try {
    // ✅ User Authentication Middleware
    const user = await authMiddleware(req);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Orders लाएं और Products की Photo, Quantity, Price Include करें
    const orders = await orderModel
      .find({ buyer: new mongoose.Types.ObjectId(user._id) })
      .populate({
        path: "products.product",
        model: productModel,
        select: "name price photo", // ✅ Name, Price और Photo Include करें
      })
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    // ✅ Image Buffer को Base64 में Convert करें
    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (item.product.photo && item.product.photo.data) {
          item.product.photo = `data:${item.product.photo.contentType};base64,${item.product.photo.data.toString(
            "base64"
          )}`;
        }
      });
    });

    return NextResponse.json({
      success: true,
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("❌ Error while fetching orders:", error);
    return NextResponse.json(
      { message: "Error while getting orders", error: error.message },
      { status: 500 }
    );
  }
}
