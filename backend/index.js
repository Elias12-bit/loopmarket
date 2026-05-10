const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/users.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/categories", require("./routes/categories.routes"));
app.use("/wishlist", require("./routes/wishlist.routes"));
app.use("/chat", require("./routes/chat.routes"));
app.use("/locations", require("./routes/locations.routes"));
app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});