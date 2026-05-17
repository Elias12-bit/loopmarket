import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API from "../api";

const EditProfile = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [form, setForm] = useState({
    username: "",
    image_url: "",
    description: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
  });

  const [oldEmail, setOldEmail] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get(`${API}/users/${user.id}`);

      setForm({
        username: res.data.username || "",
        image_url: res.data.image_url || "",
        description: res.data.description || "",
        gender: res.data.gender || "",
        dob: res.data.dob ? res.data.dob.substring(0, 10) : "",
        phone: res.data.phone || "",

        // keep email empty like you requested
        email: "",
      });

      // save old email in case user does not type a new one
      setOldEmail(res.data.email || "");
    } catch (err) {
      console.error(err);
      setError(true);
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
      const updatedData = {
        username: form.username,
        image_url: form.image_url,
        description: form.description,
        gender: form.gender,
        dob: form.dob,
        phone: form.phone,

        // if email box is empty, keep old email
        email: form.email.trim() === "" ? oldEmail : form.email,
      };

      await axios.put(`${API}/users/${user.id}`, updatedData);

      const updatedUser = {
        ...user,
        username: updatedData.username,
        email: updatedData.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      navigate("/profile");
    } catch (err) {
        console.error("Edit profile error:", err.response?.data || err);
        alert(err.response?.data?.error || "Profile was not saved");
        setError(true);
   }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="edit-profile-container" style={{ padding: "20px" }}>
      {/* TOP BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <button onClick={() => navigate("/profile")}>✖</button>

        <button onClick={handleSave}>Save</button>
      </div>

      <h2>Edit Profile</h2>

      {error && (
        <p style={{ color: "red" }}>
          Something went wrong. Profile was not saved.
        </p>
      )}

      <form>
        <label>Username:</label>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
        />

        <br />

        <label>Profile Picture URL:</label>
        <input
          name="image_url"
          value={form.image_url}
          onChange={handleChange}
        />

        <br />

        <label>Description:</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <br />

        <label>Gender:</label>
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>

        <br />

        <label>Date of Birth:</label>
        <input
          type="date"
          name="dob"
          value={form.dob}
          onChange={handleChange}
        />

        <br />

        <label>Phone Number:</label>
        <input name="phone" value={form.phone} onChange={handleChange} />

        <br />

        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter new email only if you want to change it"
        />
      </form>
    </div>
  );
};

export default EditProfile;