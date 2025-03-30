

"use client";

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import Image from "next/image";
// import Layout from "@/app/components/Layout/Layout";

const Search = () => {
  const { results } = useSelector((state) => state.search);
  const router = useRouter();

  return (
    <>
      <div className="text-center">
        <h1>Search Results</h1>
        <h6>
          {results.length === 0
            ? "No Products Found"
            : `Found ${results.length} Product(s)`}
        </h6>
        <div className="d-flex flex-wrap mt-4">
          {results.map((p) => (
            <div className="card m-2" style={{ width: "18rem" }} key={p._id}>
              <Image
                src={`http://localhost:3000/api/products/product-photo/${
                  p._id
                }?t=${new Date().getTime()}`}
                alt="Product Image"
                width={300}
                height={300}
                style={{ objectFit: "contain" }}
                unoptimized={true}
                priority={true}
              />

              <div className="card-body">
                <h5 className="card-title">{p.name}</h5>
                <p className="card-text">{p.description.substring(0, 30)}...</p>
                <p className="card-text">${p.price}</p>
                <button
                  className="btn btn-primary ms-1"
                  onClick={() => router.push(`/product/${p.slug}`)}
                >
                  More Details
                </button>
                <button className="btn btn-secondary ms-1">ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Search;

