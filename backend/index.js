import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "web2"
});

//SERVICES  

// Get all services
app.get("/services", (req, res) => {
  db.query("SELECT * FROM services", (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

// Get single service
app.get("/services/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM services WHERE id = ?", [id], (err, data) => {
    if (err) return res.json(err);
    res.json(data[0]);
  });
});

// Add new service
app.post("/services", (req, res) => {
  const { title, description, flag } = req.body;
  db.query(
    "INSERT INTO services (title, description, flag) VALUES (?, ?)",
    [title, description, flag],
    (err, data) => {
      if (err) return res.json(err);
      res.json(data);
    }
  );
});

// Update service
app.put("/services/:id", (req, res) => {
  const id = req.params.id;
  const { title, description,z
    
   } = req.body;
  db.query(
    "UPDATE services SET title = ?, description = ?, flag = ?, WHERE id = ?",
    [title, description, flag, id],
    (err, data) => {
      if (err) return res.json(err);
      res.json(data);
    }
  );
});

// Delete service
app.delete("/services/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM services WHERE id = ?", [id], (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

//SALES
// Get all sales
app.get("/sales", (req, res) => {
  db.query("SELECT * FROM sales", (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});

// Get single sale
app.get("/sales/:id", (req, res) => {
  const id = req.params.id;
  db.query("SELECT * FROM sales WHERE id = ?", [id], (err, data) => {
    if (err) return res.json(err);
    res.json(data[0]);
  });
});

// Add new sale
app.post("/sales", (req, res) => {
  const { title, description, price } = req.body;
  db.query(
    "INSERT INTO sales (title, description, price) VALUES (?, ?, ?)",
    [title, description, price],
    (err, data) => {
      if (err) return res.json(err);
      res.json(data);
    }
  );
});

// Update sales
app.put("/sales/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, price } = req.body;
  db.query(
    "UPDATE sales SET title = ?, description = ?, price = ?, WHERE id = ?",
    [title, description, price, id],
    (err, data) => {
      if (err) return res.json(err);
      res.json(data);
    }
  );
});

// Delete sales
app.delete("/sales/:id", (req, res) => {
  const id = req.params.id;
  db.query("DELETE FROM sales WHERE id = ?", [id], (err, data) => {
    if (err) return res.json(err);
    res.json(data);
  });
});
// Start server
app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
