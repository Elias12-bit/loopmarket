import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    setUser(savedUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      style={{
        backgroundColor: "#222",
        color: "white",
        padding: "15px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {/* LEFT SIDE */}
      <div className="logo" onClick={() => navigate("/")}>
  <img
    src="/logo.png"
    alt="Loop Market Logo"
    className="navbar-logo"
  />
</div>

      {/* RIGHT SIDE */}
      <div
        style={{
          display: "flex",
          gap: "20px",
          alignItems: "center",
        }}
      >
        <Link style={linkStyle} to="/">
          Home
        </Link>

        <Link style={linkStyle} to="/profile">
          Profile
        </Link>

        <Link style={linkStyle} to="/wishlist">
          Wishlist
        </Link>

        <Link style={linkStyle} to="/chat">
          Chat
        </Link>

        <Link style={linkStyle} to="/my-ads">
          My Ads
        </Link>

        {/* Admin appears only if user role is admin */}
        {user?.role === "admin" && (
          <Link style={linkStyle} to="/admin">
            Admin
          </Link>
        )}

        {!user ? (
          <>
            <Link style={linkStyle} to="/login">
              Login
            </Link>

            <Link style={buttonStyle} to="/signup">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <span
              style={{
                color: "#f5f5f5",
                fontWeight: "bold",
              }}
            >
              {user.username}
            </span>

            <button onClick={handleLogout} style={logoutStyle}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const linkStyle = {
  color: "white",
  textDecoration: "none",
  fontSize: "16px",
};

const buttonStyle = {
  backgroundColor: "#ff9800",
  color: "white",
  textDecoration: "none",
  padding: "8px 14px",
  borderRadius: "5px",
  fontSize: "16px",
};

const logoutStyle = {
  backgroundColor: "#e53935",
  color: "white",
  border: "none",
  padding: "8px 14px",
  borderRadius: "5px",
  cursor: "pointer",
  fontSize: "16px",
};

export default Navbar;