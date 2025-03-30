"use client";

import React from "react";
// import Layout from "@/components/Layout/Layout";
import useCategory from "@/app/hooks/useCategory";
import Link from "next/link";

const Categories = () => {
  const categories = useCategory();

  return (
    <>
      <div className="container">
        <div className="row">
          {categories.map((c) => (
            <div className="col-md-6 mt-5 mb-3 gx-3 gy-3" key={c._id}>
              <Link href={`/category/${c.slug}`} className="btn btn-primary">
                {c.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Categories;
