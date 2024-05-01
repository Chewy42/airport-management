const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "AirportDB",
});

router.post("/book/flight", async (req, res) => {
  try {
    const { outbound_airport_id, inbound_airport_id, airline_id } = req.body;
    const flightInfo = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM flight WHERE outbound_airport_id = ${outbound_airport_id} AND inbound_airport_id = ${inbound_airport_id} AND airline_id = ${airline_id};`,
        (err, rows) => {
          if (err) reject(err);
          const info = rows.map((row) => row);
          resolve(info);
        }
      );
    });

    res.status(200).send(flightInfo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching flights.");
  }
});

module.exports = router;
