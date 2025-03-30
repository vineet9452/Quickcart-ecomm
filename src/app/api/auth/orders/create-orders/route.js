
import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import Order from "@/models/orderModel";
import User from "@/models/userModel";
import Product from "@/models/productModel"; // ✅ Product Model Import करें

export async function POST(req) {
  try {
    await connectDB();
    const { products, payment, buyer } = await req.json();
    // 🔹 Check if User Exists
    const user = await User.findById(buyer);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "❌ User not found!" },
        { status: 404 }
      );
    }

    // 🔹 Validate Payment
    if (!payment.id || !payment.status) {
      return NextResponse.json(
        { success: false, message: "❌ Invalid Payment Data!" },
        { status: 400 }
      );
    }

    // 🔹 Ensure Cart Quantity is Stored Correctly
    const orderProducts = products.map((p) => ({
      product: p.product,
      cartQuantity: p.cartQuantity || 1,
      price: p.price,
    }));

    // 🔹 Create New Order
    const newOrder = new Order({
      products: orderProducts,
      payment: {
        id: payment.id,
        status: payment.status,
      },
      buyer: user._id,
      status: "Processing",
    });

    await newOrder.save();
    // ✅ Stock Update Logic (quantity की जगह सही किया)
    for (const item of orderProducts) {
      const product = await Product.findById(item.product);
      if (product) {
        product.quantity = Math.max(0, product.quantity - item.cartQuantity); // ✅ quantity अपडेट करें
        await product.save();
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "✅ Order placed successfully & Stock Updated!",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Error while placing order:", error);
    return NextResponse.json(
      {
        success: false,
        message: "❌ Internal Server Error!",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
