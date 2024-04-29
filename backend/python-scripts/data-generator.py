import mysql.connector
import random
from datetime import datetime, timedelta
from faker import Faker
import bcrypt

fake = Faker()

def connect_db():
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="AirportDB",
        autocommit=False
    )
    return conn

def insert_city(cursor):
    city_name = fake.city()
    cursor.execute(
        "INSERT INTO city (city_name) VALUES (%s);",
        (city_name,)
    )
    return cursor.lastrowid

def insert_airport(cursor, city_id):
    airport_name = fake.company() + " Airport"
    cursor.execute(
        "INSERT INTO airport (airport_name, city_id) VALUES (%s, %s);",
        (airport_name, city_id)
    )
    return cursor.lastrowid

def insert_airline(cursor):
    airline_name = fake.company()
    abbreviation = airline_name[:2].upper()
    cursor.execute(
        "INSERT INTO airline (airline_name, airline_abbreviation) VALUES (%s, %s);",
        (airline_name, abbreviation)
    )
    return cursor.lastrowid

def insert_flight(cursor, airline_id, outbound_id, inbound_id):
    departure_time = datetime.now() + timedelta(days=random.randint(1, 365))
    is_delayed = random.choice([True, False])
    cursor.execute(
        "INSERT INTO flight (outbound_airport_id, inbound_airport_id, airline_id, flight_departure_time, is_delayed) VALUES (%s, %s, %s, %s, %s);",
        (outbound_id, inbound_id, airline_id, departure_time, is_delayed)
    )
    return cursor.lastrowid

def hash_password(password):
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

airport_jobs = [
    "Airport Director", "Operations Manager", "Security Officer", "Flight Dispatcher",
    "Ground Handler", "Air Traffic Controller", "Baggage Handler", "Check-in Agent",
    "Ramp Agent", "Passenger Service Agent", "Aircraft Maintenance Technician",
    "Fueling Agent", "Flight Attendant", "Pilot", "Co-Pilot", "Cabin Crew Scheduler",
    "Aviation Meteorologist", "Safety Compliance Officer", "Customs Agent",
    "Immigration Officer", "First Officer", "Stowage Supervisor", "Ticketing Agent",
    "Cargo Handler", "Concierge", "Airport Planner", "Environmental Coordinator",
    "Public Affairs Manager", "Financial Analyst", "Information Desk Staff",
    "Lounge Staff", "Janitorial Staff", "Electrical Engineer", "Firefighter",
    "Paramedic", "Logistics Coordinator", "Legal Advisor", "Marketing Manager",
    "Human Resources Manager", "IT Support Technician", "Quality Control Inspector",
    "Training and Development Officer", "Airline Ticket Agent", "Gate Agent",
    "Airport Inspector", "Duty Free Sales Associate", "Airport Engineer",
    "Customer Service Manager", "Luggage System Operator", "Health and Safety Officer"
]


def insert_employee(cursor, airline_id, airport_id):
    first_name, last_name = fake.first_name(), fake.last_name()
    email, password = fake.email(), hash_password(fake.password())
    ssn = fake.ssn().replace('-', '')
    job_title = random.choice(airport_jobs)  # Randomly select a job title from the list
    salary = round(random.uniform(30000, 100000), 2)
    cursor.execute(
        "INSERT INTO employee (airline_id, airport_id, first_name, last_name, email, password, ssn, job_title, salary) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s);",
        (airline_id, airport_id, first_name, last_name, email, password, ssn, job_title, salary)
    )
    return cursor.lastrowid


def insert_passenger(cursor):
    first_name, last_name = fake.first_name(), fake.last_name()
    email, password = fake.email(), hash_password(fake.password())
    age, sex = random.randint(18, 100), fake.random_element(elements=('M', 'F'))
    phone_number = fake.phone_number()
    cursor.execute(
        "INSERT INTO passenger (first_name, last_name, email, password, age, sex, phone_number) VALUES (%s, %s, %s, %s, %s, %s, %s);",
        (first_name, last_name, email, password, age, sex, phone_number)
    )
    return cursor.lastrowid

def insert_ticket(cursor, flight_id, passenger_id, employee_id):
    seat_number, ticket_price = random.randint(1, 200), round(random.uniform(100, 1000), 2)
    is_working_flight = random.choice([True, False])
    cursor.execute(
        "INSERT INTO ticket (flight_id, passenger_id, employee_id, seat_number, ticket_price, is_working_flight) VALUES (%s, %s, %s, %s, %s, %s);",
        (flight_id, passenger_id, employee_id, seat_number, ticket_price, is_working_flight)
    )

def main():
    try:
        conn = connect_db()
        cursor = conn.cursor()

        city_ids = [insert_city(cursor) for _ in range(100)]
        airport_ids = [insert_airport(cursor, random.choice(city_ids)) for _ in range(100)]
        airline_ids = [insert_airline(cursor) for _ in range(100)]
        flight_ids = [insert_flight(cursor, random.choice(airline_ids), random.choice(airport_ids), random.choice(airport_ids)) for _ in range(100)]
        employee_ids = [insert_employee(cursor, random.choice(airline_ids), random.choice(airport_ids)) for _ in range(100)]
        passenger_ids = [insert_passenger(cursor) for _ in range(100)]
        [insert_ticket(cursor, random.choice(flight_ids), random.choice(passenger_ids), random.choice(employee_ids)) for _ in range(100)]

        conn.commit()
    except Exception as e:
        print("An error occurred:", e)
        conn.rollback()
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    main()
