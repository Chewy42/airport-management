const express = require("express");
const router = express.Router();
const mysql = require("mysql");

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

router.get("/airline/:airlineName", async (req, res) => {
    const airlineName = req.params.airlineName;
    
    try {
        const airline = await new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM airline WHERE airline_name = ?`,
            [airlineName],
            (err, rows) => {
            if (err) reject(err);
            resolve(rows[0]);
            }
        );
        });
    
        res.status(200).send(airline);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error fetching airline.");
    }
    });


    //Delete records (soft delete function would be ideal)


    //Update records

//     Make use of transactions (commit & rollback)
// 7. Generate reports that can be exported (excel or csv format)

// 8. One query must perform an aggregation/group-by clause
// 9. One query must contain a subquery.
// 10. Two queries must involve joins across at least 3 tables

module.exports = router;
