import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Landing from "./Landing";

function Dashboard() {
  const [flights, setFlights] = useState([]);
  const [yourFlights, setYourFlights] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/helper/flights")
      .then((res) => res.json())
      .then((data) => {
        setFlights(data);
        console.log(data);
      });
  }, []);

//   useEffect(() => {
//   // use email in localstorage to get users id
//   // use users id to get their flights
//   let temp_email = localStorage.getItem("email");
//   let temp_id;

//   // Assuming you have an API endpoint to get user by email
//   fetch(`http://localhost:3001/api/helper/user?email=${temp_email}`)
//     .then((res) => res.json())
//     .then((data) => {
//       temp_id = data.id;

//       // Assuming you have an API endpoint to get flights by user id
//       fetch(`http://localhost:3001/api/helper/flights?userId=${temp_id}`)
//         .then((res) => res.json())
//         .then((data) => {
//           setYourFlights(data);
//         });
//     });
// }, [flights]);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100">
      <Navbar />
      <div className="w-3/4 bg-white shadow-md rounded-lg p-6 mt-[100px]">
        <h1 className="text-2xl font-bold mb-4">Your Flights</h1>
        <div id="yourFlights" className="">
          {yourFlights.map((flight) => (
            <div
              key={flight.flight_id}
              className="flex flex-row justify-between items-center p-4 bg-gray-200 rounded-lg mb-2"
            >
              <div>
                <p className="font-bold">Flight ID: {flight.flight_id}</p>
                <p>Departure Time: {flight.flight_departure_time}</p>
                <p>Delayed: {flight.is_delayed ? "Yes" : "No"}</p>
              </div>
              <div>
                <p>Airline ID: {flight.airline_id}</p>
                <p>Outbound Airport ID: {flight.outbound_airport_id}</p>
                <p>Inbound Airport ID: {flight.inbound_airport_id}</p>
              </div>
            </div>
          ))}
      </div>
      </div>
      <div className="w-3/4 bg-white shadow-md rounded-lg p-6 mt-[100px]">
        <h1 className="text-2xl font-bold mb-4">Flights</h1>
        <div id="flights" className="">
          {flights.map((flight) => (
            <div
              key={flight.flight_id}
              className="flex flex-row justify-between items-center p-4 bg-gray-200 rounded-lg mb-2"
            >
              <div>
                <p className="font-bold">Flight ID: {flight.flight_id}</p>
                <p>Departure Time: {flight.flight_departure_time}</p>
                <p>Delayed: {flight.is_delayed ? "Yes" : "No"}</p>
              </div>
              <div>
                <p>Airline ID: {flight.airline_id}</p>
                <p>Outbound Airport ID: {flight.outbound_airport_id}</p>
                <p>Inbound Airport ID: {flight.inbound_airport_id}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



export default Dashboard;
