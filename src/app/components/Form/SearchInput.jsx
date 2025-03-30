

"use client";
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setSearchKeyword, setSearchResults } from "../../../Redux/Slices/searchSlices";
import { useRouter } from "next/navigation";

const SearchInput = () => {
    const dispatch = useDispatch();
    const [input, setInput] = useState("");
    const router = useRouter();

    // ✅ **लाइव सर्च API कॉल**
    useEffect(() => {
        const fetchProducts = async () => {
            if (!input.trim()) {
                dispatch(setSearchKeyword(""));
                dispatch(setSearchResults([])); // 🔄 प्रोडक्ट्स लिस्ट खाली करें
                // router.push("/"); // 🏠 होम पेज पर जाए
                return;
                
            }

            try {
                const response = await fetch(`/api/products/search/${encodeURIComponent(input)}`);
                const data = await response.json();
                if (data.success) {
                    dispatch(setSearchKeyword(input));
                    dispatch(setSearchResults(data.results));
                    router.push("/search-page"); // ✅ Redirect to Search Page
                    return
                } else {
                    console.error("❌ Search Error:", data.message);
                }
            } catch (error) {
                console.error("❌ Search API Error:", error.message);
            }
        };
        

        // **डिबॉउंसिंग** (तेज़ टाइपिंग को ऑप्टिमाइज़ करने के लिए)
        const delayDebounce = setTimeout(() => {
            fetchProducts();
        }, 500); // 🕐 500ms की देरी

        return () => clearTimeout(delayDebounce); // ✅ क्लीनअप
    }, [input]); // 🎯 जब `input` बदले, तब ही कॉल हो

    return (
        <div>
            <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button className="btn btn-outline-success" type="submit">
                    Search
                </button>
            </form>
        </div>
    );
};

export default SearchInput;

