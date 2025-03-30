import { authMiddleware } from "@/middleware/authMiddleware";
import { adminMiddleware } from "@/middleware/adminMiddleware";
import orderModel from "@/models/orderModel";
import { NextResponse } from "next/server";

// ✅ Update Order Status API (Admin Only)
export async function PATCH(req, { params }) {
  try {
    const user = await authMiddleware(req);
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const adminCheck = adminMiddleware(user);
    if (adminCheck.error)
      return NextResponse.json(adminCheck.response, { status: 403 });

    const { orderId } = params;
    const { status } = await req.json();

    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Order status updated successfully",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
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
