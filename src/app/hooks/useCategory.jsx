


"use client"; // ✅ Client Component बनाना जरूरी है

import { useState, useEffect } from "react";
import axios from "axios";

const useCategory = () => {
    const [categories, setCategories] = useState([]);

    // Get categories
    const getCategory = async () => {
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/category/get-category`);
            setCategories(data?.categories || []);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    useEffect(() => {
        getCategory();
    }, []);

    return categories;
};

export default useCategory;
