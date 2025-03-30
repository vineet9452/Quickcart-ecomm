"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Checkbox, Radio } from "antd";
import { Prices } from "@/app/components/Prices";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "@/Redux/Slices/cartSlices";
import toast from "react-hot-toast";
import Image from "next/image";

const HomePage = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const router = useRouter();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getAllCategory();
    getTotal();
    getAllProducts(1);
  }, []);

  const getAllCategory = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/category/get-category`
      );
      setCategories(data.success ? data.categories : []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const getAllProducts = async (pageNumber) => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-list/${pageNumber}`
      );

      setProducts((prevProducts) => {
        const uniqueProducts = [...prevProducts, ...data?.products].filter(
          (product, index, self) =>
            index === self.findIndex((p) => p._id === product._id)
        );
        return uniqueProducts;
      });

      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    } else {
      getAllProducts(1);
    }
  }, [checked, radio]);

  useEffect(() => {
    if (page > 1) {
      getAllProducts(page);
    }
  }, [page]);

  const getTotal = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-count`
      );
      setTotal(data?.total);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFilter = (value, id) => {
    setChecked(value ? [...checked, id] : checked.filter((c) => c !== id));
  };

  useEffect(() => {
    if (checked.length || radio.length) {
      filterProduct();
    } else {
      getAllProducts(1);
    }
  }, [checked, radio]);

  const filterProduct = async () => {
    try {
      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-filters`,
        { checked, radio }
      );
      setProducts(data?.products);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar Filters */}
        <div className="col-md-3">
          <h4 className="text-center bg-dark text-white p-2 rounded">
            Filters
          </h4>
          <div className="p-3 border rounded bg-light">
            <h5 className="text-primary">Category</h5>
            {categories?.map((c) => (
              <Checkbox
                key={c._id}
                className="mb-2"
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
            <h5 className="text-primary mt-3">Price</h5>
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>

            <button
              className="btn btn-danger btn-sm mt-3 w-100"
              onClick={() => {
                // setChecked([]);
                // setRadio([]);
                window.location.reload();
              }}
            >
              RESET FILTERS
            </button>
          </div>
        </div>

        {/* Product Listing */}
        <div className="col-md-9">
          <h2 className="text-center text-primary mb-3">All Products</h2>
          <div className="row">
            {products.map((p, index) => (
              <div
                className="col-lg-4 col-md-6 col-sm-12 mb-4"
                key={`${p._id}-${index}`}
              >
                <div className="card product-card shadow-sm border-0 rounded text-center">
                  <div className="position-relative">
                    <Image
                      src={`/api/products/product-photo/${
                        p._id
                      }?t=${new Date().getTime()}`} // ✅ Cache Busting
                      alt={p.name}
                      width={200}
                      height={200}
                      className="card-img-top p-3 mx-auto"
                      style={{ objectFit: "contain", height: "220px" }}
                      unoptimized={true} // ✅ Dynamic Image URL होने के कारण
                    />
                  </div>

                  <div className="card-body">
                    {/* ✅ Product Name */}
                    <h5
                      className="card-title text-dark fw-bold text-truncate"
                      title={p.name}
                    >
                      {p.name.length > 25
                        ? p.name.substring(0, 22) + "..."
                        : p.name}
                    </h5>

                    {/* ✅ Description */}
                    <p className="card-text text-muted small text-truncate">
                      {p.description.substring(0, 50)}...
                    </p>

                    {/* ✅ Price & Stock */}
                    <div className="d-flex justify-content-between align-items-center">
                      <p className="fw-bold text-danger mb-1 fs-5">
                        &#8377; {p.price}
                      </p>
                      <p className="fw-bold text-success small">
                        🏷 Stock:{" "}
                        <span
                          className={`badge ${
                            p.quantity > 0 ? "bg-secondary" : "bg-danger"
                          }`}
                        >
                          {p.quantity > 0 ? p.quantity : "Out of Stock"}
                        </span>
                      </p>
                    </div>

                    {/* ✅ Shipping Status Based on Quantity */}
                    <p className="fw-bold small d-flex align-items-center gap-2">
                      🚚 Shipping:{" "}
                      {p.quantity > 0 ? (
                        p.shipping ? (
                          <span className="text-success fw-bold">
                            ✅ Available
                          </span>
                        ) : (
                          <span className="text-warning fw-bold">
                            ⚠️ Not Available
                          </span>
                        )
                      ) : (
                        <span className="text-danger fw-bold">
                          ❌ Not Available
                        </span>
                      )}
                    </p>

                    {/* ✅ Buttons */}
                    <div className="d-flex justify-content-center gap-2 mt-3">
                      <button
                        className="btn btn-outline-primary btn-sm px-3 shadow-sm"
                        onClick={() => router.push(`/product/${p.slug}`)}
                      >
                        👀 View
                      </button>
                      <button
                        className="btn btn-warning btn-sm px-3 shadow-sm"
                        onClick={() => {
                          dispatch(addToCart(p));
                          toast.success("✅ Added to Cart!");
                        }}
                        disabled={p.quantity === 0 || !p.shipping} // ✅ अगर स्टॉक 0 है तो बटन डिसेबल कर दो
                      >
                        🛒 Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-3">
            {products.length < total && (
              <button
                className="btn btn-outline-primary"
                onClick={() => setPage((prevPage) => prevPage + 1)}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load More"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
