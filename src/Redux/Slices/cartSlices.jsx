

"use client"
import { createSlice } from "@reduxjs/toolkit";

// 🔹 LocalStorage से Cart लोड करने का फ़ंक्शन
const loadCartFromStorage = () => {
    if (typeof window !== "undefined") {
        return JSON.parse(localStorage.getItem("cart")) || [];
    }
    return [];
};

const initialState = {
    items: loadCartFromStorage(),
    totalAmount: 0,
};

// 🔹 Total Amount अपडेट करने का फ़ंक्शन
const updateTotalAmount = (items) => {
    return items.reduce((total, item) => total + item.totalPrice, 0);
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const { _id, price } = action.payload;
            const existingItem = state.items.find(item => item._id === _id);

            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.totalPrice = existingItem.quantity * price;
            } else {
                state.items.push({ ...action.payload, quantity: 1, totalPrice: price });
            }

            state.totalAmount = updateTotalAmount(state.items);
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            state.totalAmount = updateTotalAmount(state.items);
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        // 🔹 Quantity बढ़ाने का Reducer
        increaseQuantity: (state, action) => {
            const item = state.items.find(item => item._id === action.payload);
            if (item) {
                item.quantity += 1;
                item.totalPrice = item.quantity * item.price;
            }
            state.totalAmount = updateTotalAmount(state.items);
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        // 🔹 Quantity घटाने का Reducer
        decreaseQuantity: (state, action) => {
            const item = state.items.find(item => item._id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
                item.totalPrice = item.quantity * item.price;
            }
            state.totalAmount = updateTotalAmount(state.items);
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

        clearCart: (state) => {
            state.items = [];
            state.totalAmount = 0;
            localStorage.removeItem("cart");
        },
        updateStockAfterOrder: (state, action) => {
            const { orderedProducts } = action.payload;
            orderedProducts.forEach((orderedItem) => {
                const cartItem = state.items.find(item => item._id === orderedItem.product);
                if (cartItem) {
                    cartItem.stock = Math.max(0, cartItem.stock - orderedItem.cartQuantity); // ✅ स्टॉक अपडेट करें
                }
            });
            localStorage.setItem("cart", JSON.stringify(state.items));
        },

    },
});

export const { addToCart, removeFromCart, increaseQuantity, decreaseQuantity, clearCart, updateStockAfterOrder } = cartSlice.actions;
export default cartSlice.reducer;
