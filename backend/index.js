const express = require("express");
const cors = require("cors");
const app = express();
const passport = require('passport');
const session = require('express-session');
const { query } = require("./db_ops");

app.use(session({
  secret: 'fowler',
  resave: false,
  saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    // origin: "http://localhost:3000",
    origin: "*",
  })
);
app.use(express.json());

require("dotenv").config();

app.get("/", (req, res) => res.send("CPSC408 Final Project Backend"));

//sends back number of tables
app.get("/table-count", (_, res) => {
  query("SELECT * FROM airport;", (error, results) => {
    if (error) {
      console.error(error);
      res.status(500).send('Server Error');
    } else {
      res.send({ count: results.length });
    }
  });
});

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
