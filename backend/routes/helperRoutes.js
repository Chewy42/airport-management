const express = require("express");
const router = express.Router();
const mysql = require("mysql");
const fs = require("fs");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "AirportDB",
});

router.get("/airlines", async (req, res) => {
  try {
    const airlineNames = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM airline;`, (err, rows) => {
        if (err) reject(err);
        const names = rows.map((row) => row);
        resolve(names);
      });
    });

    res.status(200).send(airlineNames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching airlines.");
  }
});

router.get("/airports", async (req, res) => {
  try {
    const airportNames = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM airport;`, (err, rows) => {
        if (err) reject(err);
        const names = rows.map((row) => row);
        resolve(names);
      });
    });

    res.status(200).send(airportNames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching airports.");
  }
});

router.get("/cities", async (req, res) => {
  try {
    const cityNames = await new Promise((resolve, reject) => {
      db.query(`SELECT * FROM city;`, (err, rows) => {
        if (err) reject(err);
        const names = rows.map((row) => row);
        resolve(names);
      });
    });

    res.status(200).send(cityNames);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error fetching cities.");
  }
});

router.get("/flights", async (req, res) => {
  try {
    const query = `
      SELECT 
          f.flight_id, 
          a1.airport_name AS outbound_airport, 
          c1.city_name AS outbound_city, 
          c1.city_id AS outbound_city_id,
          a2.airport_name AS inbound_airport, 
          c2.city_name AS inbound_city, 
          c2.city_id AS inbound_city_id,
          f.flight_departure_time, 
          al.airline_name, 
          f.is_delayed
      FROM flight f
      JOIN airport a1 ON f.outbound_airport_id = a1.airport_id
      JOIN city c1 ON a1.city_id = c1.city_id
      JOIN airport a2 ON f.inbound_airport_id = a2.airport_id
      JOIN city c2 ON a2.city_id = c2.city_id
      JOIN airline al ON f.airline_id = al.airline_id;
    `;
    const flights = await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) reject(err);
        resolve(results);
      });
    });
    res.status(200).json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching flights.");
  }
});


router.get("/flights/:city_id", async (req, res) => {
  const { city_id } = req.params;

  try {
    const flightInfo = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM flight
        JOIN airport ON flight.outbound_airport_id = airport.airport_id
        JOIN city ON airport.city_id = city.city_id
        WHERE city.city_id = ?;`,
        [city_id],
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

router.patch("/employee/:id/delete", async (req, res) => {
  const { id } = req.params;
  db.query(
    "UPDATE employee SET deleted_at = NOW() WHERE employee_id = ? AND deleted_at IS NULL",
    [id],
    (err, result) => {
      if (err) return res.status(500).send("Error updating record: " + err);
      if (result.affectedRows === 0)
        return res.status(404).send("Employee not found or already deleted.");
      res.status(200).send("Employee soft deleted.");
    }
  );
});

router.get("/generate-report", async (req, res) => {
  db.query("SELECT * FROM ticket", (err, results) => {
    if (err) {
      console.error("Error fetching data: " + err);
      return res.status(500).send("Failed to fetch tickets");
    }
    let csvContent = "Ticket ID,Flight ID,Passenger ID,Price\n";
    results.forEach((row) => {
      csvContent += `${row.ticket_id},${row.flight_id},${row.passenger_id},${row.ticket_price}\n`;
    });
    fs.writeFileSync("tickets_report.csv", csvContent);
    res.download("tickets_report.csv");
  });
});

router.get("/tickets/:id", async (req, res) => {
  const { id } = req.params;
  db.query(
    "SELECT * FROM ticket WHERE passenger_id = ? OR employee_id = ?",
    [id, id],
    (err, results) => {
      if (err) return res.status(500).send("Database error");
      res.status(200).json(results);
    }
  );
});

module.exports = router;