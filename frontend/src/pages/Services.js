import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/style.css";
import ProductCard from "../components/ProductCard";

const Services = () => {
  const [services, setServices] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  // Fetch all services
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get("http://localhost:5000/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  // Delete service
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/services/${id}`);
      fetchServices();
    } catch (err) {
      console.error(err);
      setError(true);
    }
  };

  return (
      <div className="services-container">
      <h2>Services</h2>

      <button className="add-btn" onClick={() => navigate("/add-service")}>
        Add Service
      </button>


      <table className="services-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>flag</th>

            <th style={{ width: "180px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
           
            {services.map((service) => (
              <tr key={service.id}>
                <td>{service.title}</td>
                <td>{service.description}</td>
                <td>{service.flag}</td>

                <td>
                  <button
                    onClick={() =>
                      navigate(`/update-service/${service.id}`)
                    }
                  >
                    Update
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Services;
