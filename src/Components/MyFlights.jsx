import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function MyFlights() {
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [firstName, setFirstName] = useState("");
  const [myTickets, setMyTickets] = useState([]);
  const token = localStorage.getItem("token");
  const userType = localStorage.getItem("userType");
  const uid = localStorage.getItem("uid");
  const [initialRender, setInitialRender] = useState(false);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/helper/flights"
        );
        data.forEach((flight) => {
          flight.price = (Math.random() * 1000).toFixed(2);
        });
        setFlights(data);
        setFilteredFlights(data);
      } catch (error) {
        console.error(`Error fetching flights: ${error}`);
      }
    };

    const fetchName = async () => {
      try {
        const { data } = await axios.post(
          "http://localhost:3001/api/user/name",
          {
            token,
            userType,
            uid,
          }
        );
        setFirstName(data.first_name);
      } catch (error) {
        console.error(`Error fetching user data: ${error}`);
      }
    };

    const fetchMyTickts = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3001/api/helper/tickets/${uid}`
        );
        setMyTickets(data);
      } catch (error) {
        console.error(`Error fetching tickets: ${error}`);
      }
    };

    if (!initialRender) {
      fetchFlights();
      fetchName();
      fetchMyTickts();
      setInitialRender(true);
    }
  }, [token, userType, uid, initialRender]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 pt-16">
      <Navbar />
      <main className="min-w-full max-w-full w-full min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center align-middle">
        <div className="w-3/5 bg-white rounded-xl border shadow-lg p-6 mt-4 mx-auto mb-auto">
          <h1 className="text-2xl font-bold mb-4">Your Flights:</h1>
          <div className="mt-4">
            {myTickets.length > 0 ? (
              myTickets.map((ticket) => (
                <div
                  key={ticket.flight_id}
                  className="p-4 bg-gray-100 rounded-lg mb-2 text-left"
                >
                  <div className="text-left">
                    <p>
                      <strong>Flight ID:</strong> {ticket.flight_id}
                    </p>
                    <p>
                      <strong>Departure:</strong>{" "}
                      {new Date(ticket.flight_departure_time).toLocaleString(
                        "en-US"
                      )}
                    </p>
                    <p>
                      <strong>Arrival:</strong>{" "}
                      {new Date(ticket.flight_arrival_time).toLocaleString(
                        "en-US"
                      )}
                    </p>
                    <p>
                      <strong>Price:</strong> ${ticket.ticket_price}
                    </p>
                    <p>
                      <strong>Seat Number:</strong> {ticket.seat_number}
                    </p>
                    <p>
                      <strong>Flight Status:</strong>{" "}
                      {ticket.is_working_flight ? "Working" : "Not Working"}
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

export default MyFlights;
