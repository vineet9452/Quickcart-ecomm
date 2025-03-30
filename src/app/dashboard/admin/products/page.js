"use client";

import { useEffect, useState } from "react";
import AdminMenu from "@/app/components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-list/${pageNumber}`
      );

      if (data.products.length === 0) {
        setHasMore(false);
      } else {
        setProducts((prev) => [...prev, ...data.products]);
        setPageNumber((prev) => prev + 1);
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center mb-4">All Products List</h1>

            {/* ✅ Cards Container */}
            <div className="row justify-content-center">
              {products.length > 0 ? (
                products.map((p) => {
                  const isOutOfStock = p.quantity === 0;
                  const isShippingAvailable = p.shipping && !isOutOfStock;

                  return (
                    <div
                      key={p._id}
                      className="col-md-4 col-sm-6 col-12 mb-4 d-flex justify-content-center"
                    >
                      <Link
                        href={`/dashboard/admin/update-product/${p.slug}`}
                        className="product-link"
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <div className="card product-card d-flex flex-column align-items-center">
                          {/* ✅ Image */}
                          <div className="image-container">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_API_URL}/api/products/product-photo/${p._id}`}
                              alt="Product Image"
                              width={224}
                              height={224}
                              style={{ objectFit: "contain" }}
                              unoptimized={true}
                              priority={true}
                            />
                          </div>

                          {/* ✅ Card Body */}
                          <div className="card-body text-center d-flex flex-column flex-grow-1">
                            <h6 className="card-title">{p.name}</h6>
                            <p
                              className="text-muted"
                              style={{ fontSize: "14px" }}
                            >
                              Price: ₹{p.price}
                            </p>

                            {/* ✅ Stock Information */}
                            <p
                              style={{
                                fontSize: "13px",
                                fontWeight: "bold",
                                color: isOutOfStock ? "red" : "green",
                              }}
                            >
                              {isOutOfStock
                                ? "Out of Stock"
                                : `Stock: ${p.quantity}`}
                            </p>

                            {/* ✅ Shipping Information */}
                            <p
                              style={{
                                fontSize: "13px",
                                color: isShippingAvailable ? "blue" : "gray",
                              }}
                            >
                              {isShippingAvailable
                                ? "🚚 Shipping Available"
                                : "🚫 No Shipping"}
                            </p>

                            {/* ✅ Button */}
                            <div className="mt-auto">
                              <button className="btn btn-warning btn-sm w-100">
                                ✏️ Update
                              </button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })
              ) : (
                <p className="text-center w-100">No products available!</p>
              )}
            </div>

            {/* ✅ Load More Button */}
            {hasMore && (
              <div className="text-center my-4">
                <button onClick={getAllProducts} className="btn btn-primary">
                  Load More
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ CSS */}
      <style jsx>{`
        .product-card {
          width: 14rem;
          min-height: 350px; /* ✅ Fix Height for Uniformity */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          cursor: pointer;
          transition: 0.3s;
        }

        .image-container {
          width: 100%;
          display: flex;
          justify-content: center;
        }

        .product-card:hover {
          background-color: #f8f9fa;
          transform: scale(1.03);
        }
      `}</style>
    </>
  );
};

export default Products;
