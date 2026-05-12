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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post(`${API}/auth/login`, form);

    // ✅ SAVE USER IN LOCAL STORAGE (HERE)
    localStorage.setItem("user", JSON.stringify(res.data));

    // redirect after login
    navigate("/");
  } catch (err) {
    console.error(err);
    setError("Invalid email or password");
  }
};

  return (
    <div className="auth-container">

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Login</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

      </form>

      <p>
        Don't have an account? <Link to="/signup">Sign Up</Link>
      </p>

    </div>
  );
};

export default Login;