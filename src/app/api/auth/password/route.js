
import { NextResponse } from "next/server";
import userModel from "@/models/userModel";
import { hashPassword } from "@/helpers/authHelper";
import connectDB from "@/config/connectDB";

export async function POST(req) {
  try {
    // Database से कनेक्ट करें
    await connectDB();

    // Request Body प्राप्त करें
    const { email, answer, newPassword } = await req.json();

    // सभी फ़ील्ड्स का वेरिफिकेशन करें
    if (!email || !answer || !newPassword) {
      return NextResponse.json(
        { success: false, message: "सभी फ़ील्ड्स आवश्यक हैं" },
        { status: 400 }
      );
    }

    // यूज़र को खोजें
    const user = await userModel.findOne({
      email,
      answer: { $regex: new RegExp(answer, "i") }, // Case-Insensitive Matching
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "गलत ईमेल या उत्तर" },
        { status: 404 }
      );
    }

    // नया पासवर्ड हैश करें
    const hashedPassword = await hashPassword(newPassword);

    // पासवर्ड अपडेट करें
    await userModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    return NextResponse.json(
      { success: true, message: "पासवर्ड सफलतापूर्वक रीसेट कर दिया गया" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "पासवर्ड रीसेट करने में त्रुटि हुई",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
