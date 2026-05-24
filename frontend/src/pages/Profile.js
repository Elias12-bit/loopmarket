import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/users/${user.id}`);
      setUserDetails(res.data);
    } catch (err) {
      console.error("Fetch profile error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  // GUEST PROFILE VIEW
  if (!user) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <h1>Welcome to Loop Market</h1>
          <p>You need to login or create an account to view your profile.</p>

          <div className="button-group" style={{ justifyContent: "center" }}>
            <button className="btn-primary" onClick={() => navigate("/login")}>
              Login
            </button>

            <button className="btn-dark" onClick={() => navigate("/signup")}>
              Create New Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading || !userDetails) {
    return (
      <div className="profile-container">
        <div className="empty-state">
          <h2>Loading profile...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* PROFILE HEADER */}
      <div className="profile-card">
        <img
          src={
            userDetails.image ||
            userDetails.image_url ||
            "/images/default-user.png"
          }
          alt="profile"
          className="profile-image"
        />

        <div className="profile-info">
          <p
            style={{
              color: "#f59e0b",
              fontWeight: "800",
              textTransform: "uppercase",
              letterSpacing: "1px",
              marginBottom: "5px",
            }}
          >
            My Profile
          </p>

          <h1>{userDetails.username || "User"}</h1>

          <p style={{ color: "#6b7280" }}>
            Manage your account, wishlist, chats, and product listings.
          </p>

          <div className="profile-actions">
            <button
              className="btn-primary"
              onClick={() => navigate("/edit-profile")}
            >
              Edit Profile
            </button>

            <button className="btn-dark" onClick={() => navigate("/my-ads")}>
              My Ads
            </button>

            <button className="btn-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* USER DETAILS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px",
          marginTop: "30px",
        }}
      >
        <div className="card">
          <h3>Email</h3>
          <p>{userDetails.email || "Not available"}</p>
        </div>

        <div className="card">
          <h3>Phone</h3>
          <p>{userDetails.phone || "Not added"}</p>
        </div>

        <div className="card">
          <h3>Address</h3>
          <p>{userDetails.address || "Not added"}</p>
        </div>

        <div className="card">
          <h3>Role</h3>
          <p
            style={{
              fontWeight: "800",
              color: userDetails.role === "admin" ? "#f59e0b" : "#111827",
            }}
          >
            {userDetails.role || "user"}
          </p>
        </div>
      </div>

      {/* DESCRIPTION */}
      <div className="admin-section" style={{ marginTop: "30px" }}>
        <h3>About Me</h3>
        <p>{userDetails.description || "No description added yet."}</p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="admin-section">
        <h3>Quick Actions</h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          <div className="card">
            <h3>❤️ Wishlist</h3>
            <p>View products you saved for later.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/wishlist")}
            >
              Open Wishlist
            </button>
          </div>

          <div className="card">
            <h3>💬 Chats</h3>
            <p>Continue conversations with sellers and buyers.</p>
            <button className="btn-dark" onClick={() => navigate("/chat")}>
              Open Chats
            </button>
          </div>

          <div className="card">
            <h3>📦 My Ads</h3>
            <p>Manage your published products.</p>
            <button className="btn-primary" onClick={() => navigate("/my-ads")}>
              View My Ads
            </button>
          </div>

          {userDetails.role === "admin" && (
            <div className="card">
              <h3>🛠 Admin Panel</h3>
              <p>Manage users, products, categories, and reviews.</p>
              <button className="btn-dark" onClick={() => navigate("/admin")}>
                Open Admin
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;