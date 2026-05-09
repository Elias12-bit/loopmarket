import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const userId = 1; // ⚠️ replace later

  const [form, setForm] = useState({
    name: "",
    image: "",
    description: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/users/${userId}`);
      setForm(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      await axios.put(`http://localhost:5000/users/${userId}`, form);
      navigate("/profile");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="edit-profile-container">

      {/* 🔝 TOP BAR */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        
        {/* ❌ CANCEL */}
        <button onClick={() => navigate("/profile")}>
          ✖
        </button>

        {/* 💾 SAVE */}
        <button onClick={handleSave}>
          Save
        </button>

      </div>

      <h2>Edit Profile</h2>

      <form>

        <label>Name:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <label>Profile Picture (URL):</label>
        <input
          name="image"
          value={form.image}
          onChange={handleChange}
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <label>Gender:</label>
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
        >
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />

        <label>Phone:</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
        />

        <label>Email:</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
        />

      </form>

    </div>
  );
};

export default EditProfile;