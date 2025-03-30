

"use client"; // ✅ Next.js में LocalStorage के कारण यह Client-Side पर ही चलेगा

import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState      = {     
    user: null,
    token: null,
    role: "user", // Default Role
    isAuthenticated: false,
};

// ✅ Auth Slice
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.role = action.payload.user.role || "user";
            state.isAuthenticated = true;

            // ✅ LocalStorage का उपयोग केवल Client-Side पर करें
            if (typeof window !== "undefined") {
                localStorage.setItem("auth", JSON.stringify(action.payload));
            }

            // ✅ Axios Headers सेट करें
            axios.defaults.headers.common["Authorization"] = `Bearer ${action.payload.token}`;
        },

        logout: (state) => {
            state.user = null;
            state.token = null;
            state.role = "user";
            state.isAuthenticated = false;

            // ✅ LocalStorage से डेटा हटाएं
            if (typeof window !== "undefined") {
                localStorage.removeItem("auth");
            }

            // ✅ Axios Headers हटा दें
            delete axios.defaults.headers.common["Authorization"];
        },

        loadUser: (state) => {
            if (typeof window !== "undefined") {
                const storedAuth = localStorage.getItem("auth");

                if (storedAuth) {
                    const parsedAuth = JSON.parse(storedAuth);
                    state.user = parsedAuth.user;
                    state.token = parsedAuth.token;
                    state.role = parsedAuth.user?.role || "user";
                    state.isAuthenticated = true;

                    // ✅ Axios Headers सेट करें
                    axios.defaults.headers.common["Authorization"] = `Bearer ${parsedAuth.token}`;
                }
            }
        },
    },
});

// ✅ Export Actions और Reducer
export const { login, logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
