import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav style={styles.navbar}>

      {/* 🏠 LOGO */}
      <div style={styles.logo} onClick={() => navigate("/")}>
        Marketplace
      </div>

      {/* 🔗 LINKS */}
      <div style={styles.links}>

        <Link to="/">Home</Link>

        {user && (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/chat">Chat</Link>
            <Link to="/wishlist">Wishlist</Link>
          </>
        )}

        {/* 🛠️ ADMIN LINK */}
        {user?.role === "admin" && (
          <Link to="/admin">Admin</Link>
        )}

      </div>

      {/* 👤 AUTH BUTTONS */}
      <div style={styles.auth}>

        {!user ? (
          <>
            <button onClick={() => navigate("/login")}>
              Login
            </button>

            <button onClick={() => navigate("/signup")}>
              Sign Up
            </button>
          </>
        ) : (
          <>
            <span style={{ marginRight: "10px" }}>
              👤 {user.name}
            </span>

            <button onClick={handleLogout}>
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
    padding: "10px 20px",
    backgroundColor: "#222",
    color: "white",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  links: {
    display: "flex",
    gap: "15px",
  },

  auth: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
};

export default Navbar;