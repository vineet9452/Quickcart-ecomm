"use client"; // Client Component in Next.js 14

import React from "react";
import Link from "next/link";
import { FaPlus, FaBoxOpen, FaClipboardList, FaShoppingCart, FaUserShield } from "react-icons/fa";

const AdminMenu = () => {
    return (
        <div className="text-center">
            <div className="list-group shadow-sm rounded bg-white">
                {/* ✅ Admin Panel Heading */}
                <h5 className="p-3 bg-dark text-white rounded-top fw-bold">
                    <FaUserShield className="me-2" /> Admin Panel
                </h5>

                {/* ✅ Create Category */}
                <Link href="/dashboard/admin/create-category" className="list-group-item list-group-item-action admin-menu-item">
                    <FaPlus className="me-2 text-primary" /> Create Category
                </Link>

                {/* ✅ Create Product */}
                <Link href="/dashboard/admin/create-product" className="list-group-item list-group-item-action admin-menu-item">
                    <FaBoxOpen className="me-2 text-success" /> Create Product
                </Link>

                {/* ✅ Products */}
                <Link href="/dashboard/admin/products" className="list-group-item list-group-item-action admin-menu-item">
                    <FaClipboardList className="me-2 text-warning" /> Products
                </Link>

                {/* ✅ Orders */}
                <Link href="/dashboard/admin/orders" className="list-group-item list-group-item-action admin-menu-item">
                    <FaShoppingCart className="me-2 text-danger" /> Orders
                </Link>
            </div>
        </div>
    );
};

export default AdminMenu;
