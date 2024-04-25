const mysql = require("mysql");

function query(query, callback) {
  const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "AirportDB",
  });

  connection.connect();
  connection.query(query, function (error, results, fields) {
    connection.end();

    if (error) {
      callback(error);
    } else {
      callback(null, results);
    }
  });
}

module.exports = { query };