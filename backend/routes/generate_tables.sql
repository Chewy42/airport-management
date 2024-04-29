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
    phone_number VARCHAR(10) NOT NULL
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

INSERT INTO city (city_id, city_name
) VALUES
(1, 'New York'),
(2, 'Los Angeles'),
(3, 'Chicago'),
(4, 'Houston'),
(5, 'Phoenix');

INSERT INTO airport (airport_id, airport_name, city_id
) VALUES
(1, 'JFK', 1),
(2, 'LAX', 2),
(3, 'ORD', 3),
(4, 'IAH', 4),
(5, 'PHX', 5);

INSERT INTO airline (airline_id, airline_name, airline_abbreviation
) VALUES
(1, 'American Airlines', 'AA'),
(2, 'Delta Airlines', 'DL'),
(3, 'United Airlines', 'UA'),
(4, 'Southwest Airlines', 'SW'),
(5, 'JetBlue Airways', 'JB');

INSERT INTO flight (flight_id, outbound_airport_id, inbound_airport_id, airline_id, flight_departure_time, is_delayed
) VALUES
(1, 1, 2, 1, '2021-01-01 08:00:00', FALSE),
(2, 2, 1, 2, '2021-01-01 09:00:00', TRUE),
(3, 3, 4, 3, '2021-01-01 10:00:00', FALSE),
(4, 4, 5, 4, '2021-01-01 11:00:00', TRUE),
(5, 5, 1, 5, '2021-01-01 12:00:00', FALSE);

INSERT INTO employee (employee_id, airline_id, airport_id, first_name, last_name, email, password, ssn, job_title, salary
) VALUES
(1, 1, 1, 'John', 'Doe', 'jdoe@chapman.edu', 'filleraccount', '123456789', 'Pilot', 100000.00),
(2, 2, 2, 'Jane', 'Smith', 'jsmith@chapman.edu', 'filleraccount', '987654321', 'Flight Attendant', 50000.00),
(3, 3, 3, 'James', 'Johnson', 'jjohnson@chapman.edu', 'filleraccount','456789123', 'Mechanic', 60000.00),
(4, 4, 4, 'Jessica', 'Brown', 'jbrown@chapman.edu', 'filleraccount', '654321987', 'Ticket Agent', 40000.00),
(5, 5, 5, 'Jack', 'White', 'jwhite@chapman.edu', 'filleraccount','789123456', 'Baggage Handler', 30000.00);

INSERT INTO passenger (passenger_id, first_name, last_name, email, password, age, sex, phone_number
) VALUES
(1, 'Michael', 'Jordan', 'mjordan@chapman.edu', 'filleraccount', 58, 'M', '1234567890'),
(2, 'LeBron', 'James', 'ljames@chapman.edu', 'filleraccount', 36, 'M', '2345678901'),
(3, 'Kobe', 'Bryant', 'kbryant@chapman.edu', 'filleraccount', 41, 'M', '3456789012'),
(4, 'Magic', 'Johnson', 'mjohnson@chapman.edu', 'filleraccount',61, 'M', '4567890123'),
(5, 'Larry', 'Bird', 'lbird@chapman.edu', 'filleraccount', 64, 'M', '5678901234');

INSERT INTO ticket (ticket_id, flight_id, passenger_id, employee_id, seat_number, ticket_price, is_working_flight
) VALUES
(1, 1, 1, 1, 1, 500.00, TRUE),
(2, 2, 2, 2, 2, 400.00, FALSE),
(3, 3, 3, 3, 3, 300.00, TRUE),
(4, 4, 4, 4, 4, 200.00, FALSE),
(5, 5, 5, 5, 5, 100.00, TRUE);
