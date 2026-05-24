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
    address: "",
    email: "",
  });

  const [oldEmail, setOldEmail] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        address: res.data.address || "",

        // Email input stays empty unless user wants to change it
        email: "",
      });

      setOldEmail(res.data.email || "");
      setPreviewImage(res.data.image_url || "/images/default-user.png");
    } catch (err) {
      console.error("Fetch user error:", err.response?.data || err);
      setError("Failed to load profile information");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setProfileImage(file);
    setPreviewImage(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.username.trim()) {
      setError("Username is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const finalEmail =
        form.email.trim() === "" ? oldEmail : form.email.trim();

      const formData = new FormData();

      formData.append("username", form.username);
      formData.append("description", form.description);
      formData.append("gender", form.gender);
      formData.append("dob", form.dob);
      formData.append("phone", form.phone);
      formData.append("address", form.address);
      formData.append("email", finalEmail);

      // keep old image if user does not upload new one
      formData.append("image_url", form.image_url);

      if (profileImage) {
        formData.append("profile_image", profileImage);
      }

      const res = await axios.put(`${API}/users/${user.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const updatedUser = {
        ...user,
        username: form.username,
        email: finalEmail,
        image_url: res.data.image_url || form.image_url || user.image_url,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Edit profile error:", err.response?.data || err);

      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Profile was not saved";

      alert(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="edit-profile-container">
      {/* HEADER */}
      <div className="home-hero">
        <h1>Edit Profile</h1>
        <p>Update your personal information and profile picture.</p>

        <div className="button-group">
          <button className="btn-dark" onClick={() => navigate("/profile")}>
            Back to Profile
          </button>

          <button
            className="btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 2fr",
          gap: "25px",
          alignItems: "start",
        }}
      >
        {/* PROFILE IMAGE PREVIEW */}
        <div className="card" style={{ textAlign: "center" }}>
          <h2>Profile Picture</h2>

          <img
            src={previewImage || "/images/default-user.png"}
            alt="profile preview"
            style={{
              width: "170px",
              height: "170px",
              borderRadius: "50%",
              objectFit: "cover",
              border: "5px solid #f59e0b",
              background: "#e5e7eb",
              marginBottom: "20px",
            }}
          />

          <label>Upload New Picture</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />

          <p style={{ color: "#6b7280", fontSize: "14px" }}>
            Choose a profile picture from your device.
          </p>
        </div>

        {/* FORM */}
        <form>
          <h2>Personal Information</h2>

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
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="Enter your username"
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Write something about yourself..."
          />

          <label>Gender</label>
          <select name="gender" value={form.gender} onChange={handleChange}>
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={form.dob}
            onChange={handleChange}
          />

          <label>Phone Number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
          />

          <label>Address</label>
          <input
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your address"
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter new email only if you want to change it"
          />

          <div className="button-group">
            <button
              className="btn-primary"
              type="button"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              className="btn-light"
              type="button"
              onClick={() => navigate("/profile")}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;