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

// Route to soft delete an employee
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

router.get("/flight-count", async (req, res) => {
  const query = `
      SELECT airline_name, COUNT(flight_id) as num_flights
      FROM flight JOIN airline ON flight.airline_id = airline.airline_id
      GROUP BY airline.airline_id;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

router.get("/flight-count", async (req, res) => {
  const query = `
      SELECT airline_name, COUNT(flight_id) as num_flights
      FROM flight JOIN airline ON flight.airline_id = airline.airline_id
      GROUP BY airline.airline_id;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

router.get("/popular-destination", async (req, res) => {
  const query = `
      SELECT city_name, (SELECT COUNT(*) FROM flight WHERE inbound_airport_id = airport.airport_id) as num_arrivals
      FROM airport
      JOIN city ON airport.city_id = city.city_id
      ORDER BY num_arrivals DESC
      LIMIT 1;
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Database error");
    res.status(200).json(results);
  });
});

// route that returns all tickets from passenger_id or employee_id
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




// PROJECT REQUIREMENTS LEFT TO IMPLEMENT:

//1.Delete records (soft delete function would be ideal)
//2.Update records
//3.Make use of transactions (commit & rollback)
//4.Generate reports that can be exported (excel or csv format)
//5.One query must perform an aggregation/group-by clause
//6.One query must contain a subquery.
//7.Two queries must involve joins across at least 3 tables

module.exports = router;

// need to implment:

// #generate csv report

// import csv
// import mysql.connector

// def generate_csv_report():
//     # Establish a database connection
//     connection = mysql.connector.connect(
//         host='your_host',
//         user='your_username',
//         password='your_password',
//         database='your_database'
//     )

//     cursor = connection.cursor()

//     # Execute your SQL query
//     cursor.execute("SELECT booking_id, customer_id, flight_id, status, booking_date FROM bookings")

//     # Fetch all the records
//     records = cursor.fetchall()

//     # Define CSV file name
//     csv_file = "bookings_report.csv"

//     # Open a CSV file for writing
//     with open(csv_file, mode='w', newline='') as file:
//         writer = csv.writer(file)

//         # Write the headers
//         writer.writerow(['Booking ID', 'Customer ID', 'Flight ID', 'Status', 'Booking Date'])

//         # Write the data
//         for row in records:
//             writer.writerow(row)

//     # Close the cursor and the database connection
//     cursor.close()
//     connection.close()

//     print(f"CSV file '{csv_file}' has been generated.")

// # Call the function to generate the report
// generate_csv_report()

// #soft delete

// CREATE FUNCTION soft_delete(p_id INT)
// RETURNS VOID
// BEGIN
//     UPDATE your_table_name
//     SET deleted_at = NOW()
//     WHERE id = p_id AND deleted_at IS NULL;
// END;

// #creates transaction for soft delete

// CREATE PROCEDURE soft_delete(p_id INT)
// BEGIN
//     START TRANSACTION;

//     -- Attempt to mark the record as deleted
//     UPDATE your_table_name
//     SET deleted_at = NOW()
//     WHERE id = p_id AND deleted_at IS NULL;

//     -- Check if the record was successfully updated
//     IF ROW_COUNT() = 1 THEN
//         COMMIT; -- Commit the transaction if the update was successful
//     ELSE
//         ROLLBACK; -- Rollback the transaction if no row was updated
//     END IF;
// END;

// # booking flights using transactions

// START TRANSACTION;
// -- Reserve seat
// UPDATE flights SET seats_available = seats_available - 1 WHERE flight_id = X AND seats_available > 0;
// -- Process payment
// INSERT INTO payments(user_id, amount, status) VALUES(Y, Z, 'Processed');
// -- Check all operations succeeded
// IF ROW_COUNT()() = 1 THEN
//     COMMIT; -- Commit the transaction if all operations are successful
// ELSE
//     ROLLBACK; -- Rollback if any operation failed
// END IF;

// # cancel flight using transactions

// START TRANSACTION;
// -- Update flight status
// UPDATE flights SET status = 'Canceled' WHERE flight_id = X;
// -- Refund all bookings
// UPDATE bookings SET status = 'Refunded' WHERE flight_id = X;
// -- Commit or rollback based on success of updates
// IF ROW_COUNT() > 0 THEN
//     COMMIT;
// ELSE
//     ROLLBACK;
// END IF;

// #schedule changes

// START TRANSACTION;
// -- Update flight times
// UPDATE flights SET departure_time = NEW_TIME WHERE flight_id = X;
// -- Adjust bookings
// UPDATE bookings SET updated = 1 WHERE flight_id = X;
// -- Commit or rollback based on the success of updates
// IF ROW_COUNT() > 0 THEN
//     COMMIT;
// ELSE
//     ROLLBACK;
// END IF;

// # manage overbookings

// START TRANSACTION;
// -- Check for overbooked flight
// SELECT COUNT(booking_id) FROM bookings WHERE flight_id = X HAVING COUNT(booking_id) > SEAT_CAPACITY;
// -- Offer compensation and update booking
// UPDATE bookings SET status = 'Rebooked', new_flight_id = Y WHERE booking_id = Z;
// -- Ensure updates are valid
// IF ROW_COUNT() > 0 THEN
//     COMMIT;
// ELSE
//     ROLLBACK;
// END IF;
