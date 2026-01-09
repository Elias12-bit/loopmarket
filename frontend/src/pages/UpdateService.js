import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const UpdateService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [flag, setFlag] = useState("");

  const [error, setError] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/services/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setFlag(res.data.flag);

      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/services/${id}`, { title, description, flag });
      navigate("/services");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    <div>
      <h2>Update Service</h2>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description:</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />

        <label>Flag:</label>
        <input value={flag} onChange={(e) => setFlag(e.target.value)} required />

        <button type="submit">Update Service</button>
        {error && <p style={{ color: "red" }}>Something went wrong!</p>}
      </form>
      <Link to="/services">Back to Services</Link>
    </div>
  );
};

export default UpdateService;
