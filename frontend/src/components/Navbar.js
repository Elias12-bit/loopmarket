import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav style={styles.navbar}>
      {/* LOGO */}
      <div style={styles.logo} onClick={() => navigate("/")}>
        Loop Market
      </div>

      {/* LINKS */}
      <div style={styles.links}>
        <Link style={styles.link} to="/">
          Home
        </Link>

        <Link style={styles.link} to="/profile">
          Profile
        </Link>

        {/* These appear for guests and logged-in users */}
        <Link style={styles.link} to="/chat">
          Chat
        </Link>

        <Link style={styles.link} to="/wishlist">
          Wishlist
        </Link>

        <Link style={styles.link} to="/my-ads">
          My Ads
        </Link>

        {/* Admin appears only for admin */}
        {user?.role === "admin" && (
          <Link style={styles.link} to="/admin">
            Admin
          </Link>
        )}
      </div>

      {/* AUTH AREA */}
      <div style={styles.auth}>
        {!user ? (
          <>
            <button style={styles.button} onClick={() => navigate("/login")}>
              Login
            </button>

            <button style={styles.button} onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span style={styles.username}>
              👤 {user.username || user.name}
            </span>

            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 25px",
    backgroundColor: "#222",
    color: "white",
  },

  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  links: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },

  auth: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  username: {
    marginRight: "10px",
  },

  button: {
    padding: "7px 12px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
  },

  logoutButton: {
    padding: "7px 12px",
    cursor: "pointer",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "red",
    color: "white",
  },
};

export default Navbar;