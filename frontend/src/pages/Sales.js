import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";

const Sales = () => {
  const [sales, setSales] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ fetch sales
  const fetchSales = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await axios.get("http://localhost:5000/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load sales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  // ✅ delete sale
  const handleDelete = async (id) => {
  try {
    setError("");
      await axios.delete(`http://localhost:5000/sales/${id}`);
    fetchSales();
  } catch (err) {
    console.error(err);
    setError("Failed to delete sale.");
  }
};

  return (
    <div className="sales-container">
      <h2>Sales</h2>

      <button className="add-btn" onClick={() => navigate("/add-sale")}>
        Add Sale
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="sales-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map((sale) => (
              <tr key={sale.id}>
                <td>{sale.title}</td>
                <td>{sale.description}</td>
                <td>{sale.price}</td>
                <td>
                  <button onClick={() =>navigate(`/update-sale/${sale.id}`)
}>
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(sale.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Sales;