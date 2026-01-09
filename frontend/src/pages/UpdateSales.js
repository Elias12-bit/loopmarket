import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

const UpdateSales = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);

  const [error, setError] = useState("");
  

  useEffect(() => {
    axios.get(`http://localhost:5000/sales/${id}`)
      .then(res => {
        setTitle(res.data.title);
        setDescription(res.data.description);
        setPrice(res.data.price);
      })
      .catch(err => console.error(err));
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !description || price <= 0 ) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      await axios.put(`http://localhost:5000/sales/${id}`, { title, description, price });
      navigate("/sales");
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
    
    <div>
          <h2>Update Sale</h2>
          <form onSubmit={handleSubmit}>
            <label>Title:</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required />
    
            <label>Description:</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
    
              <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
          />
    
            <button type="submit">Update Sale</button>
            {error && <p style={{ color: "red" }}>Something went wrong!</p>}
          </form>
          <Link to="/sale">Back to Services</Link>
        </div>
  );
};

export default UpdateSales;