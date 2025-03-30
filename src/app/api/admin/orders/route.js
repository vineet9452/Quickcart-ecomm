import { authMiddleware } from "@/middleware/authMiddleware";
import { adminMiddleware } from "@/middleware/adminMiddleware";
import orderModel from "@/models/orderModel";
import { NextResponse } from "next/server";

// ✅ Get All Orders API (Admin Only)
export async function GET(req) {
  try {
    const user = await authMiddleware(req);
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const adminCheck = adminMiddleware(user);
    if (adminCheck.error)
      return NextResponse.json(adminCheck.response, { status: 403 });

    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      message: "All Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error while fetching orders:", error);
    return NextResponse.json(
      { message: "Error while getting orders", error: error.message },
      { status: 500 }
    );
  }
}
