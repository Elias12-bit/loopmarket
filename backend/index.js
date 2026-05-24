const express = require("express");
const cors = require("cors");
const db = require("./db");

const path = require("path");
const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// routes
app.use("/auth", require("./routes/auth.routes"));
app.use("/users", require("./routes/users.routes"));
app.use("/products", require("./routes/products.routes"));
app.use("/categories", require("./routes/categories.routes"));
app.use("/wishlist", require("./routes/wishlist.routes"));
app.use("/chat", require("./routes/chat.routes"));
app.use("/locations", require("./routes/locations.routes"));
app.use("/reviews", require("./routes/reviews.routes"));
app.get("/test-db", (req, res) => {
  db.query("SELECT 1 + 1 AS result", (err, data) => {
    if (err) return res.status(500).send(err);
    res.json(data);
  });
});
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});