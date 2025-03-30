
"use client";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword: "",
    results: [],
};

const searchSlice = createSlice({
    name: "search",
    initialState,
    reducers: {
        setSearchKeyword: (state, action) => {
            state.keyword = action.payload;
        },
        setSearchResults: (state, action) => {
            state.results = action.payload;
        },
    },
});

export const { setSearchKeyword, setSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
