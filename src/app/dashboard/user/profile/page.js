

"use client";

import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadUser } from "@/Redux/Slices/authSlices";
import UserMenu from "@/app/components/Layout/UserMenu";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // State variables
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // Load user data into state
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setPhone(user.phone);
      setAddress(user.address);
    }
  }, [user]);

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/update-user`,
        { name, email, password, phone, address }
      );

      if (data?.error) {
        toast.error(data?.error);
      } else {
        localStorage.setItem(
          "auth",
          JSON.stringify({ user: data.updatedUser, token: user.token })
        );
        dispatch(loadUser());
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.error("Profile Update Error:", error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="container-fluid p-4">
      <div className="row justify-content-center">
        {/* Sidebar */}
        <div className="col-md-3">
          <UserMenu />
        </div>

        {/* Profile Form */}
        <div className="col-md-6 d-flex justify-content-center">
          <div
            className="card shadow-lg p-4 rounded"
            style={{ width: "100%", maxWidth: "500px" }}
          >
            <h4 className="text-center fw-bold mb-3">User Profile</h4>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label fw-bold">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <input
                  type="email"
                  value={email}
                  className="form-control"
                  disabled
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-control"
                  placeholder="Enter new password"
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="form-control"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
