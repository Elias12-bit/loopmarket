import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("user")).id; // ⚠️ later replace with logged user

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`https://loopmarket-backend1.onrender.com/users/${userId}`);
      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔴 LOGOUT FUNCTION
  const handleLogout = () => {
    localStorage.removeItem("user"); // remove stored user
    navigate("/login"); // go to login page
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">

      {/* 👤 USER INFO */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "20px",
          marginBottom: "20px",
        }}
      >
        <img
          src={user.image || "/images/default-user.png"}
          alt="profile"
          style={{
            width: "90px",
            height: "90px",
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />

        <div>
          <h2>{user.name}</h2>

          <button
            onClick={() => navigate("/edit-profile")}
            style={{ marginTop: "10px" }}
          >
            ✏️ View & Edit Profile
          </button>
        </div>
      </div>

      {/* ❤️ WISHLIST */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/wishlist")}>
          ❤️ Wishlist
        </button>
      </div>

      {/* 🔴 LOGOUT */}
      <div>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: "red",
            color: "white",
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          🚪 Logout
        </button>
      </div>

    </div>
  );
};

export default Profile;