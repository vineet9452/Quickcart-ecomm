import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: { type: Number, required: true },
    shipping: { type: Boolean, default: false },
    photo: {
      data: Buffer,
      contentType: String,
    },
  },
  { timestamps: true }
);

// ✅ **Duplicate Model Error से बचने के लिए**
const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
