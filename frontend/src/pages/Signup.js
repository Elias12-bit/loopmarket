import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const Signup = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!username.trim() || !email.trim() || !password.trim()) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(`${API}/auth/signup`, {
        username,
        email,
        password,
      });

      // Save the new user immediately
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("Account created successfully");

      // Go to home page as logged in user
      navigate("/");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Signup failed";

      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p>Join Loop Market and start buying or selling second-hand products.</p>

        {error && (
          <div
            style={{
              background: "#fee2e2",
              color: "#991b1b",
              padding: "12px",
              borderRadius: "12px",
              marginBottom: "18px",
              fontWeight: "700",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <label>Username</label>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p style={{ marginTop: "18px", textAlign: "center" }}>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            style={{
              color: "#f59e0b",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;