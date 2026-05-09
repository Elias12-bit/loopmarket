const crypto = require("crypto");
const db = require("../db");

const verifySignature = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const signature = req.headers["x-signature"];
  const timestamp = req.headers["x-timestamp"];

  if (!apiKey || !signature || !timestamp) {
    return res.status(401).json({ message: "Missing authentication headers" });
  }

  // ⏱️ Prevent replay attack (5 minutes)
  const now = Date.now();
  if (Math.abs(now - timestamp) > 5 * 60 * 1000) {
    return res.status(401).json({ message: "Request expired" });
  }

  db.query(
    "SELECT * FROM users WHERE api_key=?",
    [apiKey],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid API key" });
      }

      const user = result[0];

      const payload = req.method + req.originalUrl + timestamp;

      const expectedSignature = crypto
        .createHmac("sha256", user.api_secret)
        .update(payload)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(403).json({ message: "Invalid signature" });
      }

      req.user = user; // attach user
      next();
    }
  );
};

module.exports = verifySignature;