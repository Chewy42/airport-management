import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [firstName, setFirstName] = useState("");

  // Getting authentication details from local storage
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    // Fetch flight details from the API
    axios
      .get("http://localhost:3001/api/helper/flights")
      .then((response) => {
        setFlights(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch flights:", error);
      });

    // Fetch the first name of the user
    axios
      .post("http://localhost:3001/api/user/name", { token, userType, uid })
      .then((response) => {
        setFirstName(response.data.first_name);
      })
      .catch((error) => {
        console.error("Failed to fetch user data:", error);
      });
  }, [token, userType, uid]); // Dependencies for useEffect to control when it re-runs

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 pt-16">
      <Navbar />
      <main className="min-w-full max-w-full w-full min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center align-middle">
        <div className="w-3/5 bg-white rounded-xl border shadow-lg p-6 mt-4 mx-auto mb-auto">
          <h1 className="text-2xl font-bold mb-4">
            Welcome, {firstName || "Guest"}!
          </h1>
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-4">Available Flights:</h2>
            {flights.length > 0 ? (
              flights.map((flight) => (
                <div
                  key={flight.flight_id}
                  className="p-4 bg-gray-100 rounded-lg mb-2 text-left"
                >
                  <div className="text-left">
                    <p>
                      <strong>Flight ID:</strong> {flight.flight_id}
                    </p>
                    <p>
                      <strong>Departure:</strong>{" "}
                      {new Date(flight.flight_departure_time).toLocaleString(
                        "en-US"
                      )}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {flight.is_delayed ? "Delayed" : "On time"}
                    </p>
                  </div>
                  <div className="text-left">
                    <p>
                      <strong>Outbound City:</strong> {flight.outbound_city}
                    </p>
                    <p>
                      <strong>Outbound Airport:</strong>{" "}
                      {flight.outbound_airport}
                    </p>
                    <p>
                      <strong>Inbound City:</strong> {flight.inbound_city}
                    </p>
                    <p>
                      <strong>Inbound Airport:</strong> {flight.inbound_airport}
                    </p>
                    <p>
                      <strong>Airline:</strong> {flight.airline_name}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>No flights available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
