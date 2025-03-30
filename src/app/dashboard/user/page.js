"use client"; // ✅ Client Component बनाना जरूरी है

import React from "react";
import { useSelector } from "react-redux"; // Redux Toolkit से उपयोग करें
import UserMenu from "@/app/components/Layout/UserMenu"; // ✅ सही इंपोर्ट करें

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75 p-3">
              <h3>User Name: {user?.name}</h3>
              <h3>User Email: {user?.email}</h3>
              <h3>User Contact: {user?.phone}</h3>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
