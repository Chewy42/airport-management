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

router.post("/book/flight", async (req, res) => {
  const {
    token,
    flight_id,
    passenger_id,
    seat_number,
    ticket_price,
    is_working_flight,
  } = req.body;

  // Check if all required fields are provided
  if (
    !token ||
    !flight_id ||
    !passenger_id ||
    !seat_number ||
    !ticket_price ||
    is_working_flight === null
  ) {
    return res.status(400).send("All fields are required.");
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      console.error(err.message);
      return res.status(401).send("Invalid token.");
    }
  });

  db.query(
    `INSERT INTO ticket (flight_id, passenger_id, seat_number, ticket_price, is_working_flight) VALUES (?, ?, ?, ?, ?)`,
    [flight_id, passenger_id, seat_number, ticket_price, is_working_flight],
    (err) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error booking flight.");
      }

      res.status(200).send("Flight booked successfully.");
    }
  );
});

module.exports = router;
