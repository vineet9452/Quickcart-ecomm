"use client"; // क्लाइंट-साइड रेंडरिंग के लिए

import { useEffect, useState } from "react";
import AdminMenu from "@/app/components/Layout/AdminMenu";
import { useSelector } from "react-redux";
import axios from "axios";
import moment from "moment";
import { Select, message } from "antd";
import Image from "next/image";

const { Option } = Select;

const AdminOrders = () => {
  const [statusOptions] = useState([
    "Not Process",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ]);
  const [orders, setOrders] = useState([]);
  const { token } = useSelector((state) => state.auth);

  // ✅ ऑर्डर डेटा लाने का फ़ंक्शन
  const getOrders = async () => {
    if (!token) return;
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/orders/all-orders`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ Payment Status और Total Price को Calculate करें
      const updatedOrders = data.orders.map((order) => {
        const totalPrice = order.products?.reduce(
          (acc, item) => acc + (item.price || 0) * (item.quantity || item.cartQuantity || 1),
          0
        );

        return {
          ...order,
          paymentStatus:
            order.payment?.status === "success" ? "✅ Paid" : "❌ Failed",
          totalPrice: totalPrice || 0, // ✅ Default Value
        };
      });

      setOrders(updatedOrders);
    } catch (error) {
      console.error("❌ Error fetching orders:", error);
      message.error("Failed to fetch orders. Please try again later.");
    }
  };

  useEffect(() => {
    getOrders();
  }, [token]);

  // ✅ ऑर्डर स्टेटस अपडेट फ़ंक्शन
  const handleChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/orders/order-status/${orderId}`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      message.success("✅ Order status updated successfully");
      getOrders(); // ✅ डेटा रिफ्रेश करें
    } catch (error) {
      console.error("❌ Error updating order status:", error);
      message.error("Failed to update status. Try again later.");
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1 className="text-center">📦 All Orders</h1>
          {orders.length === 0 ? (
            <p className="text-center">No orders found</p>
          ) : (
            orders.map((order, index) => {
              return (
                <div className="bordershadow mb-4 p-3" key={order._id}>
                  {/* ✅ Table को Scrollable बनाया */}
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead className="thead-dark">
                        <tr>
                          <th>#</th>
                          <th>Status</th>
                          <th>Buyer</th>
                          <th>Date</th>
                          <th>Payment</th>
                          <th>Quantity</th>
                          <th>Total Price (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{index + 1}</td>
                          <td>
                            <Select
                              variant="borderless"
                              onChange={(value) =>
                                handleChange(order._id, value)
                              }
                              defaultValue={order.status}
                              style={{ width: 150 }}
                            >
                              {statusOptions.map((s, i) => (
                                <Option key={i} value={s}>
                                  {s}
                                </Option>
                              ))}
                            </Select>
                          </td>
                          <td>{order?.buyer?.name || "Unknown"}</td>
                          <td>{moment(order.createdAt).fromNow()}</td>
                          <td
                            className={
                              order.paymentStatus === "✅ Paid"
                                ? "text-success"
                                : "text-danger"
                            }
                          >
                            {order.paymentStatus}
                          </td>
                          <td>
                            {order.products?.reduce(
                              (acc, item) => acc + (item.quantity || item.cartQuantity || 0),
                              0
                            ) || 0}
                          </td>
                          <td>
                            <strong>₹{order.totalPrice || 0}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* ✅ ऑर्डर के प्रोडक्ट्स (Grid Layout में - 1 Row में 4 प्रोडक्ट्स) */}
                  <div className="container">
                    <div className="row">
                      {order.products?.map((product) => {
                        const productId = product.product?._id || product._id;
                        return (
                          <div
                            className="col-lg-3 col-md-4 col-sm-6 mb-3 d-flex align-items-stretch"
                            key={productId}
                          >
                            <div className="card p-2 w-100 text-center">
                              {productId ? (
                                <Image
                                  src={`/api/products/product-photo/${productId}?t=${new Date().getTime()}`} 
                                  alt={"product_photo"}
                                  width={80}
                                  height={80}
                                  className="card-img-top mx-auto"
                                  style={{
                                    objectFit: "contain",
                                    height: "120px",
                                  }}
                                  unoptimized={true} // ✅ Dynamic Image URL होने के कारण
                                />
                              ) : (
                                <p>No Image</p>
                              )}
                              <div className="card-body">
                                <p className="mb-1">
                                  <strong>{product.product?.name || "Unknown"}</strong>
                                </p>
                                <p className="mb-1">₹{product.price || 0}</p>
                                <p className="mb-1">
                                  Quantity: <strong>{product.quantity || product.cartQuantity || 0}</strong>
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
};

export default AdminOrders;
