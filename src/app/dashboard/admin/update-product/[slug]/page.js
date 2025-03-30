

"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AdminMenu from "@/app/components/Layout/AdminMenu";
import toast from "react-hot-toast";
import Image from "next/image";

const UpdateProduct = ({ params }) => {
  const router = useRouter();
  const { slug } = params;
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [shipping, setShipping] = useState(false); // ✅ Default `false` किया
  const [photo, setPhoto] = useState(null);
  const [id, setId] = useState("");

  // ✅ एकल उत्पाद लाने के लिए API कॉल
  const getSingleProduct = async () => {
    try {
      const res = await fetch(`/api/products/${slug}`);
      const data = await res.json();

      if (res.ok) {
        setName(data.product.name);
        setId(data.product._id);
        setDescription(data.product.description);
        setPrice(data.product.price);
        setQuantity(data.product.quantity);
        setShipping(data.product.shipping || false); // ✅ Null से बचने के लिए default false
        setCategory(data.product.category._id);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  useEffect(() => {
    getSingleProduct();
  }, []);

  // ✅ सभी श्रेणियाँ (Categories) लाने के लिए API कॉल
  const getAllCategory = async () => {
    try {
      const res = await fetch("/api/category/get-category");
      const data = await res.json();
      setCategories(data.success ? data.categories : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Something went wrong in getting category");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // ✅ उत्पाद अपडेट करने का फ़ंक्शन
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("quantity", quantity);
      productData.append("shipping", shipping ? "true" : "false"); // ✅ String में नहीं, सीधे Boolean भेजें
      photo && productData.append("photo", photo);
      productData.append("category", category);

      const res = await fetch(`/api/products/update-product/${id}`, {
        method: "PUT",
        body: productData,
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Product Updated Successfully");
        router.push("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Something went wrong");
    }
  };

  // ✅ उत्पाद को हटाने का फ़ंक्शन
  const handleDelete = async () => {
    let confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/products/delete-product/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Product deleted successfully");
        router.push("/dashboard/admin/products");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container-fluid m-3 p-3">
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>Update Product</h1>
          <div className="m-1 w-75">
            {/* श्रेणी चयन */}
            <select
              className="form-select mb-3"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select a category
              </option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* फोटो अपलोड */}
            <div className="mb-3">
              <label className="btn btn-outline-secondary col-md-12">
                {photo ? photo.name : "Upload Photo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPhoto(e.target.files[0])}
                  hidden
                />
              </label>
            </div>

            {/* फोटो प्रीव्यू */}
            <div className="mb-3 text-center">
              {photo ? (
                <img
                  src={URL.createObjectURL(photo)}
                  alt="product_photo"
                  height="200px"
                  className="img img-responsive"
                />
              ) : (
                <Image
                  src={`/api/products/product-photo/${id}?t=${new Date().getTime()}`}
                  alt={"product_photo"}
                  width={200}
                  height={200}
                  className="card-img-top p-3 mx-auto"
                  style={{ objectFit: "contain", height: "220px" }}
                  unoptimized={true}
                />
              )}
            </div>

            {/* इनपुट फील्ड्स */}
            <div className="mb-3">
              <input
                type="text"
                value={name}
                placeholder="Product Name"
                className="form-control"
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <textarea
                value={description}
                placeholder="Product Description"
                className="form-control"
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={price}
                placeholder="Price"
                className="form-control"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                value={quantity}
                placeholder="Quantity"
                className="form-control"
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            {/* ✅ Shipping Fix */}
            <div className="mb-3">
              <select
                className="form-select mb-3"
                value={shipping ? "Yes" : "No"}
                onChange={(e) => setShipping(e.target.value === "Yes")}
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>

            {/* अपडेट और डिलीट बटन */}
            <div className="mb-3">
              <button className="btn btn-primary" onClick={handleUpdate}>
                UPDATE PRODUCT
              </button>
            </div>
            <div className="mb-3">
              <button className="btn btn-danger" onClick={handleDelete}>
                DELETE PRODUCT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;
