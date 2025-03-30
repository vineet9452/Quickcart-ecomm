

import { configureStore } from "@reduxjs/toolkit";
import authReducer, { loadUser } from "./Slices/authSlices";
import cartReducer from "./Slices/cartSlices";
import searchReducer from "./Slices/searchSlices";

const store = configureStore({
    reducer: {
        auth: authReducer,
        cart: cartReducer,
        search: searchReducer,
    },
    devTools: process.env.NODE_ENV !== "production",
});

// ✅ Store लोड होते ही `loadUser()` को डिस्पैच करें (क्लाइंट साइड में)
if (typeof window !== "undefined") {
    store.dispatch(loadUser());
}

export default store;
