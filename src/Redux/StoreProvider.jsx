

"use client"; 

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "../Redux/Slices/authSlices";
import { Provider } from "react-redux";
import store from "./Store"; // अपने Redux store को इंपोर्ट करें

export default function StoreProvider({ children }) {
    return (
        <Provider store={store}>
            <AuthLoader />
            {children}
        </Provider>
    );
}

// ✅ `loadUser()` को `Provider` के बाहर `useEffect` में कॉल करें
function AuthLoader() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadUser()); // ✅ पेज लोड होते ही LocalStorage से डेटा लोड करें
    }, [dispatch]);

    return null;
}
