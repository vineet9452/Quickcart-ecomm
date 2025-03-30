"use client";

import React from "react";
import Link from "next/link";
import { FaUser, FaShoppingBag, FaTachometerAlt } from "react-icons/fa";

const UserMenu = () => {
    return (
        <div className="text-center">
            <div className="list-group shadow-sm rounded bg-white">
                {/* Dashboard Title */}
                <h5 className="p-3 bg-primary text-white rounded-top fw-bold">
                    <FaTachometerAlt className="me-2" /> Dashboard
                </h5>

                {/* Profile Link */}
                <Link href="/dashboard/user/profile" className="list-group-item list-group-item-action small-menu-item">
                    <FaUser className="me-2 text-primary" /> Profile
                </Link>

                {/* Orders Link */}
                <Link href="/dashboard/user/orders" className="list-group-item list-group-item-action small-menu-item">
                    <FaShoppingBag className="me-2 text-success" /> Orders
                </Link>
            </div>
        </div>
    );
};

export default UserMenu;
