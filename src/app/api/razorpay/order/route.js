
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req) {
  try {
    const { amount } = await req.json();

    // ✅ Amount Validation (Valid number and greater than 0)
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // ✅ Convert INR → Paisa (₹500 → 50000 paisa)
    const amountInPaisa = Math.round(Number(amount) * 100);

    // ✅ Razorpay Instance Create
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    // ✅ Order Options
    const options = {
      amount: amountInPaisa, // Paisa में Convert किया गया
      currency: "INR",
      receipt: `order_rcptid_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    // ✅ Create Order in Razorpay
    const order = await razorpay.orders.create(options);

    return NextResponse.json({ success: true, order }, { status: 200 });
  } catch (error) {
    console.error("🔥 Razorpay Order Error:", error);
    return NextResponse.json(
      { error: "Failed to create order", details: error.message },
      { status: 500 }
    );
  }
}
