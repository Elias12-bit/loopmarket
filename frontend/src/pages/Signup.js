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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    try {
      await axios.post(`${API}/auth/signup`, form);

      alert("Account created successfully!");

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError("Email already exists or something went wrong");
    }
  };

  return (
    <div className="auth-container">

      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>

        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

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

        <button type="submit">Sign Up</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>

    </div>
  );
};

export default Signup;