import connectDB from "@/config/connectDB";
import Order from "@/models/orderModel";
import { NextResponse } from "next/server";

// ✅ Database Connect करें
connectDB();

// ✅ Order Status Update API
export async function PUT(req, { params }) {
  try {
    const { orderId } = params;
    const { status } = await req.json();

    // 🛑 अगर Order ID या Status नहीं मिला
    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Order ID and status are required" },
        { status: 400 }
      );
    }

    // 🔍 ऑर्डर खोजें और अपडेट करें
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    // 🛑 अगर ऑर्डर नहीं मिला
    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    // ✅ सफलतापूर्वक अपडेट होने पर प्रतिक्रिया भेजें
    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("❌ Error updating order status:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error while updating order",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
