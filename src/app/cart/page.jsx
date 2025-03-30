
"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
    updateStockAfterOrder
} from "@/Redux/Slices/cartSlices";
import axios from "axios";
import Image from "next/image";

const Cart = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const auth = useSelector((state) => state.auth);

    useEffect(() => {
        if (!window.Razorpay) {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.async = true;
            document.body.appendChild(script);
        }
    }, []);

    // ✅ कुल कीमत की गणना करें
    const totalPrice = () =>
        cart.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

    // ✅ Order Create API के लिए Cart Data को Format करें (cartQuantity सही किया)
    const formattedCart = cart.map((item) => ({
        product: item._id,
        cartQuantity: item.quantity || 1, // ✅ यहाँ `cartQuantity` key सही की
        price: item.price,
    }));

    const handlePayment = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/razorpay/order`,
                { amount: totalPrice() }
            );

            if (!data || !data.order || !data.order.id) {
                throw new Error("❌ Razorpay Order Creation Failed!");
            }

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: "INR",
                name: "QuickCart",
                description: "Order Payment",
                order_id: data.order.id,
                handler: async function (response) {
                    alert(`✅ Payment Successful! Payment ID: ${response.razorpay_payment_id}`);

                    // ✅ Order Create API Call करें और Stock Update करें
                    const orderResponse = await axios.post(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/orders/create-orders`,
                        {
                            products: formattedCart,
                            payment: {
                                id: response.razorpay_payment_id,
                                status: "success",
                            },
                            buyer: auth?.user?._id,
                        }
                    );

                    if (orderResponse.data.success) {
                        // ✅ Redux Store में Stock Update करें
                        dispatch(updateStockAfterOrder({ orderedProducts: formattedCart }));

                        dispatch(clearCart());
                        router.push("/dashboard/user/orders");
                    } else {
                        alert("❌ Order Created, but Stock Update Failed!");
                    }
                },
                prefill: {
                    name: auth?.user?.name || "Guest",
                    email: auth?.user?.email || "guest@example.com",
                    contact: auth?.user?.phone || "9999999999",
                },
                theme: { color: "#3399cc" },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();

            razorpay.on("payment.failed", function (response) {
                alert(`❌ Payment Failed: ${response.error.description}`);
                setLoading(false);
            });
        } catch (error) {
            alert("❌ Payment Failed: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <h2 className="text-primary text-center mb-4">Your Shopping Cart</h2>

                    {cart.length > 0 ? (
                        cart.map((p) => (
                            <div
                                key={p._id}
                                className="card shadow-sm mb-3 p-3 d-flex flex-row align-items-center justify-content-between"
                            >
                                {/* ✅ Product Image */}
                                <div className="col-md-3 text-center">
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_API_URL}/api/products/product-photo/${p._id}`}
                                        alt={p.name}
                                        width={120}
                                        height={120}
                                        className="rounded shadow"
                                        style={{ objectFit: "contain" }}
                                        unoptimized
                                    />
                                </div>

                                {/* ✅ Product Details */}
                                <div className="col-md-6">
                                    <h5 className="fw-bold">{p.name}</h5>
                                    <p className="text-muted small">
                                        {p.description.substring(0, 40)}...
                                    </p>
                                    <p className="text-danger fw-bold">₹ {p.price}</p>
                                    <button
                                        className="btn btn-sm btn-outline-danger mt-2"
                                        onClick={() => dispatch(removeFromCart(p._id))}
                                    >
                                        Remove Item
                                    </button>
                                </div>

                                {/* ✅ Quantity Section */}
                                <div className="col-md-3 text-end">
                                    <p className="fw-bold text-success">Quantity:</p>
                                    <div className="d-flex align-items-center justify-content-end">
                                        <button
                                            className="btn btn-sm btn-outline-primary me-2"
                                            onClick={() => dispatch(decreaseQuantity(p._id))}
                                        >
                                            {" "}
                                            -{" "}
                                        </button>
                                        <p className="fw-bold text-success mb-0">{p.quantity}</p>
                                        <button
                                            className="btn btn-sm btn-outline-primary ms-2"
                                            onClick={() => dispatch(increaseQuantity(p._id))}
                                        >
                                            {" "}
                                            +{" "}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <h4 className="text-center text-muted">Your cart is empty</h4>
                    )}
                </div>

                {/* ✅ Cart Summary */}
                <div className="col-md-4">
                    <div className="card shadow-sm p-4">
                        <h3 className="text-center">Cart Summary</h3>
                        <hr />
                        <h4 className="text-center">Total: ₹{totalPrice()}</h4>

                        {auth?.user?.address ? (
                            <div className="text-center">
                                <h5>Address:</h5>
                                <p className="text-muted">{auth?.user?.address}</p>
                                <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => router.push("/dashboard/user/profile")}
                                >
                                    Update Address
                                </button>
                            </div>
                        ) : auth?.token ? (
                            <div className="text-center">
                                <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => router.push("/dashboard/user/profile")}
                                >
                                    Add Address
                                </button>
                            </div>
                        ) : (
                            <div className="text-center">
                                <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => router.push("/login")}
                                >
                                    Please Login to Checkout
                                </button>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-lg mt-3 w-100"
                            onClick={handlePayment}
                            disabled={loading || cart.length === 0 || !auth?.user?.address}
                        >
                            {loading ? "Processing..." : "Pay with Razorpay"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
