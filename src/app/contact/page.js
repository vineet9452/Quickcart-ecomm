"use client";

import React from "react";
import Image from "next/image";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
// import Layout from "../components/Layout/Layout";

const Contact = () => {
  return (
    <>
      <div className="container mt-4">
        <div className="row contactus align-items-center">
          <div className="col-md-6">
            <Image
              src="/images/contactus.jpeg"
              alt="Contact Us"
              width={600}
              height={400}
              className="img-fluid"
            />
          </div>
          <div className="col-md-6">
            <h1 className="bg-dark text-white text-center p-2">CONTACT US</h1>
            <p className="mt-3">Any query or info about the product? Feel free to call anytime. We are available 24/7.</p>
            <p className="mt-3"><BiMailSend /> : <a href="mailto:help@ecommerceapp.com">help@ecommerceapp.com</a></p>
            <p className="mt-3"><BiPhoneCall /> : <a href="tel:0123456789">012-3456789</a></p>
            <p className="mt-3"><BiSupport /> : <a href="tel:18000000000">1800-0000-0000 (Toll-Free)</a></p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
