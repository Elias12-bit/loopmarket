import React, { useState } from "react";
import { ServicesList } from "../data/ServicesList";
import "../styles/registration.css";

function Registration() {
  const [state, setState] = useState({
    selectedService: "",
    selectedSale: "",
    tableRows: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "selectedService" && value !== "") {
      const service = ServicesList.find((s) => s.title === value);

      if (service) {
        setState((prev) => ({
          ...prev,
          tableRows: [
            ...prev.tableRows,
            {
              type: "Service",
              title: service.title,
              description: service.description,
            },
          ],
          selectedService: "",
        }));
      }
    }

    
  };

  return (
    <div className="registration-container">
      <h2>Registration Table</h2>

      <div className="selects">
        <div className="service">
          <label>Select Service:</label>
          <select
            name="selectedService"
            value={state.selectedService}
            onChange={handleChange}
          >
            <option value="">-- Choose a service --</option>
            {ServicesList.map((service, index) => (
              <option key={index} value={service.title}>
                {service.title}
              </option>
            ))}
          </select>
        </div>

        <div className="sale">
          <label>Select Sale:</label>
          <select
            name="selectedSale"
            value={state.selectedSale}
            onChange={handleChange}
          >
            
            
          </select>
        </div>
      </div>

      <table className="registration-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Title</th>
            <th>Description</th>
          </tr>
        </thead>

        <tbody>
          {state.tableRows.map((row, index) => (
            <tr key={index}>
              <td>{row.type}</td>
              <td>{row.title}</td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Registration;
