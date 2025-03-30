import { NextResponse } from "next/server";
import connectDB from "@/config/connectDB";
import userModel from "@/models/userModel";
import { comparePassword, hashPassword } from "@/helpers/authHelper";
import jwt from "jsonwebtoken";


const generateToken = (user) => {
  return jwt.sign(
    { _id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export async function POST(req) {
  try {
    await connectDB(); // ✅ पहले DB से कनेक्ट करें

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Email not registered" },
        { status: 404 }
      );
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return NextResponse.json(
        { success: false, message: "Invalid password" },
        { status: 401 }
      );
    }

    const token = generateToken(user);
    return NextResponse.json(
      { success: true, message: "Login successful", user, token },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error during login", error: error.message },
      { status: 500 }
    );
  }
}
