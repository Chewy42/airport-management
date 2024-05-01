ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';

#CREATE DATABASE AirportDB;
CREATE TABLE city (
    city_id INT AUTO_INCREMENT PRIMARY KEY,
    city_name VARCHAR(50) NOT NULL
);
CREATE TABLE airport (
    airport_id INT AUTO_INCREMENT PRIMARY KEY,
    airport_name VARCHAR(50) NOT NULL,
    city_id INT,
    FOREIGN KEY (city_id) REFERENCES city(city_id)
);
CREATE TABLE airline (
    airline_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_name VARCHAR(50) NOT NULL,
    airline_abbreviation VARCHAR(10) NOT NULL
);
CREATE TABLE flight (
    flight_id INT AUTO_INCREMENT PRIMARY KEY,
    outbound_airport_id INT,
    inbound_airport_id INT,
    airline_id INT,
    flight_departure_time DATETIME,
    is_delayed BOOLEAN,
    FOREIGN KEY (outbound_airport_id) REFERENCES airport(airport_id),
    FOREIGN KEY (inbound_airport_id) REFERENCES airport(airport_id),
    FOREIGN KEY (airline_id) REFERENCES airline(airline_id)
);
CREATE TABLE employee (
    employee_id INT AUTO_INCREMENT PRIMARY KEY,
    airline_id INT,
    airport_id INT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(65) NOT NULL,
    ssn VARCHAR(9) NOT NULL,
    job_title VARCHAR(50) NOT NULL,
    salary DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (airline_id) REFERENCES airline(airline_id),
    FOREIGN KEY (airport_id) REFERENCES airport(airport_id)
);
CREATE TABLE passenger (
    passenger_id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(65) NOT NULL,
    age INT NOT NULL,
    sex CHAR(1) NOT NULL,
    phone_number VARCHAR(50) NOT NULL
);
CREATE TABLE ticket (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    flight_id INT NOT NULL,
    passenger_id INT,
    employee_id INT,
    seat_number INT NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    is_working_flight BOOLEAN,
    FOREIGN KEY (flight_id) REFERENCES flight(flight_id),
    FOREIGN KEY (passenger_id) REFERENCES passenger(passenger_id),
    FOREIGN KEY (employee_id) REFERENCES employee(employee_id)
);