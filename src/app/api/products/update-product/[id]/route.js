
import { NextResponse } from "next/server";
import Product from "@/models/productModel";
import connectDB from "@/config/connectDB";
import slugify from "slugify";
import fs from "fs";

export async function PUT(req, { params }) {
  await connectDB(); // ✅ MongoDB से कनेक्ट करें

  try {
    const formData = await req.formData(); // ✅ `formData()` से डेटा प्राप्त करें

    // ✅ फॉर्म डेटा से फ़ील्ड्स निकालें
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const quantity = formData.get("quantity");
    const shipping = formData.get("shipping");
    const photo = formData.get("photo"); // ✅ फोटो एक्सेस करें

    // ✅ Validation
    if (!name)
      return NextResponse.json({ error: "Name is Required" }, { status: 400 });
    if (!description)
      return NextResponse.json(
        { error: "Description is Required" },
        { status: 400 }
      );
    if (!price)
      return NextResponse.json({ error: "Price is Required" }, { status: 400 });
    if (!category)
      return NextResponse.json(
        { error: "Category is Required" },
        { status: 400 }
      );
    if (!quantity)
      return NextResponse.json(
        { error: "Quantity is Required" },
        { status: 400 }
      );

    // ✅ प्रोडक्ट को अपडेट करें
    const product = await Product.findByIdAndUpdate(
      params.id, // ✅ URL से ID प्राप्त करें
      {
        name,
        description,
        price,
        category,
        quantity,
        shipping,
        slug: slugify(name),
      },
      { new: true, runValidators: true }
    );

    // यदि प्रोडक्ट नहीं मिला
    if (!product) {
      return NextResponse.json(
        { success: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // ✅ फोटो को MongoDB में स्टोर करें
    if (photo) {
      const bytes = await photo.arrayBuffer(); // ✅ फोटो को बाइट्स में बदलें
      product.photo.data = Buffer.from(bytes);
      product.photo.contentType = photo.type;
      await product.save(); // ✅ प्रोडक्ट को सेव करें
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error in updating product:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in updating product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

