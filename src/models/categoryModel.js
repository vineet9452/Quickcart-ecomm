
import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
  },
  { timestamps: true }
);

// ✅ अगर मॉडल पहले से डिफाइन है तो उसे यूज़ करो, वरना नया बनाओ
const Category =
  mongoose.models.Category || mongoose.model("Category", categorySchema);

export default Category;
