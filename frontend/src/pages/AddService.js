import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const AddService = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flag, setFlag] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/services", { title, description, flag });
      navigate("/services");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div>
      <h2>Add Service</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>flag:</label>
        <input value={flag} onChange={(e) => setFlag(e.target.value)} required />
        <button type="submit">Add Service</button>
        {error && <p style={{ color: "red" }}>Something went wrong!</p>}
      </form>
      <Link to="/services">Back to Services</Link>
    </div>
  );
};

export default AddService;
