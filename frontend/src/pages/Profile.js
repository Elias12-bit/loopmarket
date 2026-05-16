import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Profile = () => {
  const [userDetails, setUserDetails] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/users/${user.id}`);
      setUserDetails(res.data);
    } catch (err) {
      console.error(err);
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
      <div className="profile-container" style={{ padding: "20px" }}>
        <h2>Profile</h2>
        <p>You are not logged in.</p>

        <button onClick={() => navigate("/login")}>
          Login
        </button>

        <button
          onClick={() => navigate("/signup")}
          style={{ marginLeft: "10px" }}
        >
          Create New Account
        </button>
      </div>
    );
  }

  if (!userDetails) return <p>Loading...</p>;

  return (
    <div className="profile-container" style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <img
          src={userDetails.image || userDetails.image_url || "/images/default-user.png"}
          alt="profile"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div>
          <h2>{userDetails.username}</h2>

          <button onClick={() => navigate("/edit-profile")}>
            View & Edit Profile
          </button>
        </div>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/wishlist")}>
          ❤️ Wishlist
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/chat")}>
          💬 Chats
        </button>
      </div>

      <button
        onClick={handleLogout}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;