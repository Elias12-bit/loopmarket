import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email.trim() || !form.password.trim()) {
      setError("Please enter your email and password");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${API}/auth/login`, form);

      localStorage.setItem("user", JSON.stringify(res.data));

      navigate("/");
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div
        className="card"
        style={{
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <h1>Welcome Back</h1>

        <p style={{ color: "#6b7280" }}>
          Login to manage your listings, wishlist, chats, and profile.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Login</h2>

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

        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password</label>
        <input
          type="password"
          name="password"
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#6b7280",
        }}
      >
        Don't have an account?{" "}
        <Link
          to="/signup"
          style={{
            color: "#f59e0b",
            fontWeight: "800",
          }}
        >
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default Login;