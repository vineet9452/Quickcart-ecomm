
"use client";

import { useEffect, useState } from "react";
import AdminMenu from "@/app/components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";

const Products = () => {
  const [products, setProducts] = useState([]); // ✅ सभी Products को Store करें
  const [pageNumber, setPageNumber] = useState(1); // ✅ पेज नंबर Track करें
  const [hasMore, setHasMore] = useState(true); // ✅ अगर और प्रोडक्ट्स Available हैं तो True

  // ✅ API से डेटा Fetch करें
  const getAllProducts = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/products/product-list/${pageNumber}`
      );

      if (data.products.length === 0) {
        setHasMore(false); // ❌ अगर प्रोडक्ट्स खत्म हो गए तो Load More हटाएँ
      } else {
        setProducts((prev) => [...prev, ...data.products]); // ✅ पुराने Products में नए जोड़ें
        setPageNumber((prev) => prev + 1); // ✅ पेज नंबर बढ़ाएँ
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong!");
    }
  };

  // ✅ पहली बार पेज लोड होने पर Products लाएँ
  useEffect(() => {
    getAllProducts();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">All Products List</h1>

          {/* ✅ Cards Container */}
          <div className="d-flex flex-wrap justify-content-between">
            {products.length > 0 ? (
              products.map((p) => {
                const isOutOfStock = p.quantity === 0; // ✅ Stock Check
                const isShippingAvailable = p.shipping && !isOutOfStock; // ✅ अगर Out of Stock है तो Shipping भी नहीं होगी

                return (
                  <Link
                    key={p._id}
                    href={`/dashboard/admin/update-product/${p.slug}`}
                    className="product-link"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <div
                      className="card product-card"
                      style={{
                        width: "14rem", // ✅ Card Width छोटा किया
                        cursor: "pointer",
                        transition: "0.3s",
                        marginBottom: "20px",
                      }}
                    >
                      <Image
                        src={`http://localhost:3000/api/products/product-photo/${
                          p._id
                        }?t=${new Date().getTime()}`}
                        alt="Product Image"
                        width={224} // ✅ Image Width 14rem (224px) के अनुसार सेट किया
                        height={224}
                        style={{ objectFit: "contain" }}
                        unoptimized={true}
                        priority={true}
                      />
                      <div className="card-body text-center">
                        <h6 className="card-title">{p.name}</h6>
                        <p className="text-muted" style={{ fontSize: "14px" }}>
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

                        {/* ✅ "Update Product" बटन */}
                        <button className="btn btn-warning btn-sm w-100">
                          ✏️ Update
                        </button>
                      </div>
                    </div>
                  </Link>
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

      {/* ✅ CSS */}
      <style jsx>{`
        .product-card:hover {
          background-color: #f8f9fa;
          transform: scale(1.03);
        }

        @media (max-width: 1200px) {
          .product-card {
            width: 18%; /* ✅ 5 Cards in a Row */
          }
        }

        @media (max-width: 992px) {
          .product-card {
            width: 22%; /* ✅ 4 Cards in a Row */
          }
        }

        @media (max-width: 768px) {
          .product-card {
            width: 30%; /* ✅ 3 Cards in a Row */
          }
        }

        @media (max-width: 576px) {
          .product-card {
            width: 45%; /* ✅ 2 Cards in a Row */
          }
        }
      `}</style>
    </>
  );
};

export default Products;
