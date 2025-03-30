
"use client";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";

export default function UserPrivate({ children }) {
    const { token } = useSelector((state) => state.auth);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            router.replace("/login"); // 🔄 replace() से यूज़र history में back नहीं जा पाएगा
        } else {
            setLoading(false);
        }
    }, [token, router]);

    if (loading) {
        return <Spinner />; // 🔄 जब तक auth चेक हो रहा है, तब तक Spinner दिखाएं
    }

    return <>{children}</>; // 🔹 अब यह सिर्फ़ Authenticated Users को ही दिखेगा
}
