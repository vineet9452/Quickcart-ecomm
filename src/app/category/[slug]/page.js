

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "@/Redux/Slices/cartSlices"; // ✅ Redux action इम्पोर्ट करें
import { toast } from "react-hot-toast"; // ✅ Toast इम्पोर्ट करें

const CategoryProduct = () => {
  const router = useRouter();
  const { slug } = useParams();
  const dispatch = useDispatch(); // ✅ Redux Dispatch

  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});

  useEffect(() => {
    if (slug) getProductsByCat();
  }, [slug]);

  const getProductsByCat = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/category/${slug}`
      );
      setProducts(data?.products || []);
      setCategory(data?.category || {});
    } catch (error) {
      console.error("Error fetching category products:", error);
    }
  };

  // 🛒 ✅ Add to Cart Function
  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`); // ✅ Toast notification
  };

  return (
    <div className="container mt-3">
      <h4 className="text-center">
        Category - {category?.name || "Loading..."}
      </h4>
      <h6 className="text-center">{products?.length || 0} results found</h6>
      <div className="row">
        <div className="d-flex flex-wrap">
          {products.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/products/product-photo/${p._id}`}
                className="card-img-top"
                alt={p.name}
              />
              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text">${p.price}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => router.push(`/product/${p.slug}`)}
                >
                  More Details
                </button>
                <button
                  className="btn btn-secondary ms-1"
                  onClick={() => handleAddToCart(p)}
                >
                  ADD TO CART
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryProduct;
