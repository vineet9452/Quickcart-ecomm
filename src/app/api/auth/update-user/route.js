import { authMiddleware } from "../../../../middlewares/authMiddleware";
import { hashPassword } from "@/helpers/authHelper";
import userModel from "@/models/userModel";
import { NextResponse } from "next/server";

// ✅ Update Profile API
export async function PUT(req) {
  try {
    const user = await authMiddleware(req);
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { name, password, address, phone } = await req.json();
    let hashedPassword = user.password;

    // ✅ Validate & Hash Password if provided
    if (password) {
      if (password.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }
      hashedPassword = await hashPassword(password);
    }

    // ✅ Update User Profile
    const updatedUser = await userModel.findByIdAndUpdate(
      user._id,
      {
        name: name || user.name,
        password: hashedPassword,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    return NextResponse.json(
      { message: "Error updating profile", error: error.message },
      { status: 500 }
    );
  }
}
