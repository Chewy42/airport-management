const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "fowler";

// Database connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "AirportDB",
});

//curl -X POST http://localhost:3001/api/auth/signup/employee -H "Content-Type: application/json" -d '{"firstName": "Cory","lastName": "Treverson","email": "ctreverson@americanairlines.com","password": "examplepassword","jobTitle": "Pilot","salary": 80000.00,"airlineId": 1,"airportId": 1,"ssn": "123456789"}'

// Signup route for employee
router.post("/signup/employee", async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    jobTitle,
    salary,
    airlineId,
    airportId,
    ssn,
  } = req.body;

  // Check if all required fields are provided
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !jobTitle ||
    !salary ||
    !airlineId ||
    !airportId ||
    !ssn
  ) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Check if the email already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM employee WHERE email = ?`,
        [email],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows.length > 0);
        }
      );
    });

    if (existingUser) {
      return res.status(400).send("Email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    const generateUniqueEmployeeId = async () => {
      const employeeId = Math.floor(Math.random() * 1000000);
      const existingEmployee = await new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM employee WHERE employee_id = ?`,
          [employeeId],
          (err, rows) => {
            if (err) reject(err);
            resolve(rows.length > 0);
          }
        );
      });

      if (existingEmployee) {
        return generateUniqueEmployeeId();
      }

      return employeeId;
    };

    const employeeId = await generateUniqueEmployeeId();

    // Insert the employee into the database
    await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO employee (employee_id, first_name, last_name, email, password, job_title, salary, airline_id, airport_id, ssn) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          employeeId,
          firstName,
          lastName,
          email,
          hashedPassword,
          jobTitle,
          salary,
          airlineId,
          airportId,
          ssn,
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(200).send("Employee registered successfully.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error during signup.");
  }
});

// Signup route for passenger
router.post("/signup/passenger", async (req, res) => {
  const { firstName, lastName, email, password, age, sex, phoneNumber } =
    req.body;

  // Check if all required fields are provided
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !age ||
    !sex ||
    !phoneNumber
  ) {
    return res.status(400).send("All fields are required.");
  }

  try {
    // Check if the email already exists
    const existingUser = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM passenger WHERE email = ?`,
        [email],
        (err, rows) => {
          if (err) reject(err);
          resolve(rows.length > 0);
        }
      );
    });

    if (existingUser) {
      return res.status(400).send("Email already exists.");
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insert the passenger into the database
    await new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO passenger (first_name, last_name, email, password, age, sex, phone_number) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email, hashedPassword, age, sex, phoneNumber],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.status(200).send("Passenger registered successfully.");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error during signup.");
  }
});

// Common Signin route for both passenger and employee
router.post("/signin", async (req, res) => {
  const { email, password, userType } = req.body;

  if (!email || !password || !userType) {
    return res.status(400).send("Email, password, and user type are required.");
  }

  const table = userType === "employee" ? "employee" : "passenger";

  // Check if the email exists in the correct table
  db.query(
    `SELECT * FROM ${table} WHERE email = ?`,
    [email],
    async (err, rows) => {
      if (err) {
        console.error(err.message);
        return res.status(500).send("Error querying the database.");
      }

      if (rows.length === 0) {
        return res.status(400).send("Email not found.");
      }

      const user = rows[0];

      try {
        const match = await bcrypt.compare(password, user.password);

        if (!match) {
          return res.status(401).send("Authentication failed.");
        }

        // If the passwords match, create a JWT
        const token = jwt.sign(
          { id: user.employee_id || user.passenger_id },
          JWT_SECRET,
          {
            expiresIn: "100h",
          }
        );

        res.json({ token });
      } catch (err) {
        console.error(err.message);
        return res.status(500).send("Error during authentication.");
      }
    }
  );
});

module.exports = router;
