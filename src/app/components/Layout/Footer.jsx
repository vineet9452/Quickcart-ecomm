

"use client"; // Client Component in Next.js 14

import React from "react";
import Link from "next/link";


const Footer = () => {
  return (
    <>
      <div className="footer">
        <h1 className="text-center">All Right Reserved &copy;</h1>
        <p className="text-center mt-3">
          <Link href="/about">About</Link> |{" "}
          <Link href="/contact">Contact</Link> |{" "}
          <Link href="/policy">Privacy Policy</Link>
        </p>
      </div>
    </>
  );
};

export default Footer;
