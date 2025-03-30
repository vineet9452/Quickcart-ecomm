
import { NextResponse } from "next/server";
import slugify from "slugify";
import productModel from "@/models/productModel";

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const category = formData.get("category");
    const quantity = formData.get("quantity");
    const shipping = formData.get("shipping");
    const photo = formData.get("photo"); // ✅ Photo File मिल रही है?

    if (!name || !description || !price || !category || !quantity) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    let slug = slugify(name, { lower: true, strict: true });
    let existingProduct = await productModel.findOne({ slug });
    if (existingProduct) {
      slug = `${slug}-${Date.now()}`;
    }

    const product = new productModel({
      name,
      slug,
      description,
      price,
      category,
      quantity,
      shipping,
    });

    // ✅ Correct way to handle file
    if (photo) {
      const buffer = Buffer.from(await photo.arrayBuffer()); // ✅ Convert file to Buffer
      product.photo.data = buffer;
      product.photo.contentType = photo.type;
    }

    await product.save();

    return NextResponse.json(
      { success: true, message: "Product Created Successfully", product },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create Product Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error in creating product",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
