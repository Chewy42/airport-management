const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "fowler";

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "AirportDB",
});

router.post("/name", async (req, res) => {
  const { token, userType, uid } = req.body;

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err.message);
      return res.status(401).send("Invalid token.");
    }

    const table = userType === "employee" ? "employee" : "passenger";

    db.query(
      `SELECT first_name, last_name  FROM ${table} WHERE ${table}_id = ?`,
      [uid],
      (err, rows) => {
        if (err) {
          console.error(err.message);
          return res.status(500).send("Error querying the database.");
        }

        if (rows.length === 0) {
          return res.status(400).send("User not found.");
        }

        const user = rows[0];

        res.status(200).send({ first_name: user.first_name, last_name: user.last_name });
      }
    );
  });
});

module.exports = router;
