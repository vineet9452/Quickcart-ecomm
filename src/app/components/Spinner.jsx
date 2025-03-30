

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Spinner = ({ path = "login" }) => {
    const [count, setCount] = useState(3);
    const router = useRouter();

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);

        if (count === 0) {
            router.push(`/${path}`);
        }

        return () => clearInterval(interval);
    }, [count, router, path]);

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: "100vh" }}>
            <h1 className="text-center">Redirecting to you in {count} second</h1>
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default Spinner;
