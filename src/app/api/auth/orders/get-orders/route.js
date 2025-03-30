import { NextResponse } from "next/server";
import dbConnect from "@/config/connectDB";
import Order from "@/models/orderModel";
import Product from "@/models/productModel";
import { authMiddleware } from "../../../../../middlewares/authMiddleware"; // ✅ Authentication Middleware

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ लॉगिन किए गए यूज़र को Authenticate करें
    const authCheck = await authMiddleware(req);
    if (!authCheck.success) return authCheck.response;

    const user = authCheck.user; // ✅ Authenticated User
    // ✅ सिर्फ़ लॉगिन किए हुए यूज़र के Orders लाएँ (Sorting के साथ)
    const orders = await Order.find({ buyer: user._id })
      .populate("buyer", "name email") // ✅ `buyer` में Name और Email
      .populate("products.product", "name description price photo") // ✅ Products Details
      .sort({ createdAt: -1 }); // ✅ नया ऑर्डर सबसे पहले आएगा

    // ✅ ऑर्डर को सही फ़ॉर्मेट में भेजें
    const formattedOrders = orders.map((order) => ({
      _id: order._id,
      buyer: order.buyer,
      products: order.products.map((p) => ({
        _id: p.product?._id || "",
        name: p.product?.name || "Unknown",
        description: p.product?.description || "No description",
        price: p.product?.price || 0,
        quantity: p.cartQuantity || 1, // ✅ सही Quantity
      })),
      payment: order.payment,
      status: order.status,
      createdAt: order.createdAt,
    }));

    return NextResponse.json({ success: true, orders: formattedOrders });
  } catch (error) {
    console.error("❌ Error while fetching orders:", error);
    return NextResponse.json(
      { success: false, message: "❌ Internal Server Error!" },
      { status: 500 }
    );
  }
}

