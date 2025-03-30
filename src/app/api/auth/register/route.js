
import { comparePassword, hashPassword } from "@/helpers/authHelper";
// import orderModel from "@/models/orderModel";
import userModel from "@/models/userModel";
// import jwt from "jsonwebtoken";
import  connectDB  from "@/config/connectDB";

// MongoDB कनेक्शन स्थापित करें
connectDB();

// JWT टोकन जनरेट करने वाला फ़ंक्शन
// const generateToken = (user) => {
//   return jwt.sign(
//     { _id: user._id, email: user.email, role: user.role },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// };

// ✅ **Register API (POST /api/auth/register)**
export async function POST(req) {
  try {
    const { name, email, password, phone, address, answer } = await req.json();

    if (!name || !email || !password || !phone || !address || !answer) {
      return Response.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return Response.json(
        { success: false, message: "User already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await hashPassword(password);
    const user = await userModel.create({
      name,
      email,
      phone,
      address,
      password: hashedPassword,
      answer,
    });

    return Response.json(
      { success: true, message: "User registered successfully", user },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Error in registration",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
