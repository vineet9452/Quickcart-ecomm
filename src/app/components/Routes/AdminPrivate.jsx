"use client";

import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";

export default function AdminPrivate({ children }) {
    const { user, token } = useSelector((state) => state.auth);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token || user?.role !== 1) {
            router.push("/login"); // ✅ अगर Admin नहीं है तो Redirect करो
        } else {
            setLoading(false);
        }
    }, [user, token, router]);

    if (loading) {
        return <Spinner />; // ✅ Loading Animation दिखाओ
    }

    return <>{children}</>;
}
