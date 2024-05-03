import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

function MyFlights() {
  const [flights, setFlights] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const token = localStorage.getItem("token");
  const uid = localStorage.getItem("uid");
  const [firstName, setFirstName] = useState("");

  const [ticketInfo, setTicketInfo] = useState(null);

  useEffect(() => {
    const fetchFlightsAndTickets = async () => {
      try {
        const flightsResponse = await axios.get(
          "http://localhost:3001/api/helper/flights"
        );
        const flightsData = flightsResponse.data;
        setFlights(flightsData);

        const ticketsResponse = await axios.get(
          `http://localhost:3001/api/helper/tickets/${uid}`
        );
        const ticketsData = ticketsResponse.data;
        ticketsData.forEach((ticket) => {
          const flight = flightsData.find(
            (f) => f.flight_id === ticket.flight_id
          );
          if (flight) {
            ticket.outbound_airport = flight.outbound_airport;
            ticket.inbound_airport = flight.inbound_airport;
            ticket.outbound_city = flight.outbound_city;
            ticket.inbound_city = flight.inbound_city;
            ticket.airline_name = flight.airline_name;
            ticket.is_delayed = flight.is_delayed;
          }
        });
        setMyTickets(ticketsData);
      } catch (error) {
        console.error(`Error fetching data: ${error}`);
      }
    };

    const fetchName = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/api/user/name",
          {
            token,
            uid,
          }
        );
        setFirstName(response.data.first_name);
      } catch (error) {
        console.error(`Error fetching user name: ${error}`);
      }
    };

    fetchFlightsAndTickets();
    fetchName();
  }, [token, uid]);

  const handleButtonClick = (ticket) => {
    setTicketInfo(ticket);
  };

  const handleCancelFlight = async (e) => {
    let flight = ticketInfo;
    e.preventDefault();
    // get uid from local storage
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");
    // post to /api/booking/book with flight_id, passenger_id or employee_id, seat_number (randomly generated), ticket price we have listed for that flight in the html below, is_working_flight BOOLEAN

    try {
      const response = await axios.post(
        "http://localhost:3001/api/booking/cancel/flight",
        {
          token,
          flight_id: ticketInfo.flight_id,
          passenger_id: uid,
          seat_number: Math.floor(Math.random() * 100),
          ticket_price: ticketInfo.ticket_price,
          is_working_flight: false,
        }
      );

      //tell them success and give them their seat number and price
      alert(`Successfully canceled your flight.`);
    } catch (error) {
      alert(`${error}}`);
      console.error(`Error cancelling flight: ${error}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 pt-16">
      <Navbar />
      <main className="min-w-full max-w-full w-full min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center align-middle">
        <div className="w-3/5 bg-white rounded-xl border shadow-lg p-6 mt-4 mx-auto mb-auto">
          <h1 className="text-2xl font-bold mb-4">Your Flights:</h1>
          <div className="mt-4">
            {myTickets.length > 0 ? (
              myTickets.map((ticket) => (
                <form onSubmit={(e)=>handleCancelFlight(e,ticket)}>
                <div
                  key={ticket.ticket_id}
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
                      <strong>Status:</strong>{" "}
                      {ticket.is_delayed ? "Delayed" : "On time"}
                    </p>
                    <p>
                      <strong>Outbound City:</strong> {ticket.outbound_city}
                    </p>
                    <p>
                      <strong>Outbound Airport:</strong>{" "}
                      {ticket.outbound_airport}
                    </p>
                    <p>
                      <strong>Inbound City:</strong> {ticket.inbound_city}
                    </p>
                    <p>
                      <strong>Inbound Airport:</strong> {ticket.inbound_airport}
                    </p>
                    <p>
                      <strong>Airline:</strong> {ticket.airline_name}
                    </p>
                    <p>
                      <strong>Price:</strong> ${ticket.ticket_price}
                    </p>
                  </div>
                  <button
                    className="mt-4 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    type="submit"
                    onClick={() => handleButtonClick(ticket)}
                  >
                    Cancel Flight
                  </button>
                </div>
                </form>
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
