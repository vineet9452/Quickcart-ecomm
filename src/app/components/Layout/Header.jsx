

"use client";

import React, { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux"; // Redux hooks
import { logout } from "@/Redux/Slices/authSlices"; // Redux Logout action
import SearchInput from "@/app/components/Form/SearchInput";
import useCategory from "@/app/hooks/useCategory";
import { Badge } from "antd";

const Header = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const categories = useCategory();
  const cart = useSelector((state) => state.cart.items) || [];
  const auth = useSelector((state) => state.auth);

  const [isMounted, setIsMounted] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const navbarRef = useRef(null); // Navbar के लिए रेफरेंस

  useEffect(() => {
    setIsMounted(true);
    if (auth?.user?.role === 1) {
      setIsAdmin(true);
    }
  }, [auth?.user?.role]);

  if (!isMounted) return null;

  // ✅ Logout Function
  const handleLogout = () => {
    dispatch(logout());
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(";").forEach((c) => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    toast.success("Logout Successfully");
    router.push("/login");
    closeNavbar(); // ✅ Logout के बाद Navbar बंद करें
  };

  // ✅ **Navbar को बंद करने का फ़ंक्शन**
  const closeNavbar = () => {
    if (navbarRef.current) {
      navbarRef.current.classList.remove("show");
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand" onClick={closeNavbar}>
          🛒 ECOMMERCE APP
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent" ref={navbarRef}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <SearchInput />
            <li className="nav-item">
              <Link href="/" className="nav-link" onClick={closeNavbar}>
                Home
              </Link>
            </li>

            {/* ✅ Categories Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Categories
              </a>
              <ul className="dropdown-menu">
                <li>
                  <Link href="/categories" className="dropdown-item" onClick={closeNavbar}>
                    All Categories
                  </Link>
                </li>
                {categories?.map((c) => (
                  <li key={c._id}>
                    <Link href={`/category/${c.slug}`} className="dropdown-item" onClick={closeNavbar}>
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* ✅ Auth Links */}
            {!auth.user ? (
              <>
                <li className="nav-item">
                  <Link href="/register" className="nav-link" onClick={closeNavbar}>
                    Register
                  </Link>
                </li>
                <li className="nav-item">
                  <Link href="/login" className="nav-link" onClick={closeNavbar}>
                    Login
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    {auth?.user?.name}
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <Link href={`/dashboard/${isAdmin ? "admin" : "user"}`} className="dropdown-item" onClick={closeNavbar}>
                        Dashboard
                      </Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="dropdown-item">
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            )}

            {/* ✅ Cart Icon */}
            <li className="nav-item">
              <Link href="/cart" className="nav-link" onClick={closeNavbar}>
                <Badge count={cart?.length || 0} showZero offset={[10, -5]}>
                  Cart
                </Badge>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
