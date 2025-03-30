

"use client";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import UserMenu from "@/app/components/Layout/UserMenu";
import Image from "next/image";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { token } = useSelector((state) => state.auth);

  // ✅ Orders Fetch करने का Function
  const getOrders = async () => {
    if (!token) return; // ✅ अगर User Login नहीं है तो API Call न करें

    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/orders/get-orders`,
        {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Auth Token Pass करें
        }
      );

      setOrders(data.orders || []); // ✅ अगर API Empty Response दे तो Default []
    } catch (error) {
      console.error("❌ Failed to fetch orders:", error);
    }
  };

  useEffect(() => {
    if (token) getOrders();
  }, [token]);

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-3">
          <UserMenu />
        </div>
        <div className="col-md-9">
          <h2 className="text-primary text-center mb-4">Your Orders</h2>

          {orders?.length > 0 ? (
            orders.map((o, i) => (
              <div key={o._id} className="card shadow-sm p-4 mb-3">
                {/* ✅ Order Summary */}
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold">Order #{i + 1}</h5>
                  <span
                    className={`badge ${
                      o?.payment?.status === "success"
                        ? "bg-success"
                        : "bg-danger"
                    }`}
                  >
                    {o?.payment?.status === "success" ? "✅ Paid" : "❌ Failed"}
                  </span>
                </div>

                <p className="text-muted small mb-2">
                  Ordered {moment(o?.createdAt).fromNow()} | Buyer:{" "}
                  {o?.buyer?.name}
                </p>

                {/* ✅ Order Status */}
                <p className="mb-2">
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      o?.status === "Pending"
                        ? "bg-warning"
                        : o?.status === "Shipped"
                        ? "bg-info"
                        : o?.status === "Delivered"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {o?.status || "Unknown"}
                  </span>
                </p>

                {/* ✅ Ordered Products */}
                {o.products?.map((p, index) => (
                  <div
                    key={p._id}
                    className="d-flex align-items-center border-bottom py-2"
                  >
                    {/* ✅ Product Image */}
                    <div className="me-3">
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/products/product-photo/${p._id}`}
                        alt={p.name}
                        width={80}
                        height={80}
                        className="rounded shadow"
                        style={{ objectFit: "contain" }}
                        unoptimized
                      />
                    </div>

                    {/* ✅ Product Details */}
                    <div className="flex-grow-1">
                      <h6 className="fw-bold">
                        {p.name.length > 25
                          ? `${p.name.substring(0, 25)}...`
                          : p.name}
                      </h6>
                      <p className="text-muted small mb-1">
                        {p.description.length > 40
                          ? `${p.description.substring(0, 40)}...`
                          : p.description}
                      </p>

                      {/* ✅ सही Quantity और Total */}
                      <p className="mb-0">
                        <strong>Price:</strong> ₹ {p.price} x{" "}
                        <span className="fw-bold text-success">
                          {p?.quantity || 1}
                        </span>{" "}
                        ={" "}
                        <span className="fw-bold text-primary">
                          ₹ {p.price * (p?.quantity || 1)}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}

                {/* ✅ सही Total Amount */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <h6 className="fw-bold">Total Amount:</h6>
                  <h5 className="text-primary fw-bold">
                    ₹{" "}
                    {o.products.reduce(
                      (acc, p) => acc + p.price * (p?.quantity || 1),
                      0
                    )}
                  </h5>
                </div>
              </div>
            ))
          ) : (
            <h4 className="text-center text-muted">No orders placed yet</h4>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
