const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "loopmarket",
});

db.connect((err) => {
  if (err) console.log(err);
  else console.log("DB connected");
});

module.exports = db;