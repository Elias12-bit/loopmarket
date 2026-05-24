import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import API from "../api";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
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

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      await axios.post(`${API}/auth/signup`, form);

      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Email already exists or something went wrong"
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
        <h1>Create Account</h1>
        <p style={{ color: "#6b7280" }}>
          Join Loop Market and start buying or selling second-hand products.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

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

        <label>Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter your username"
          value={form.username}
          onChange={handleChange}
          required
        />

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
          placeholder="Create a password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div
        style={{
          textAlign: "center",
          marginTop: "20px",
          color: "#6b7280",
        }}
      >
        Already have an account?{" "}
        <Link
          to="/login"
          style={{
            color: "#f59e0b",
            fontWeight: "800",
          }}
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Signup;