
import mongoose from "mongoose";

// ✅ User Schema Define
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String, // Fixed: पहले `{}` था, जिससे Type Issue था
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: 0, // 0 => Normal User, 1 => Admin
    },
  },
  { timestamps: true }
);

// ✅ Next.js 14 के अनुसार Model को Register करना
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
