import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import Navbar from "./Navbar";
import { SlPlane } from "react-icons/sl";
import { FaK } from "react-icons/fa6";

const Booking = () => {
  const [cities, setCities] = useState([]);
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [outboundCity, setOutboundCity] = useState("");
  const [inboundCity, setInboundCity] = useState("");
  const [flightInfo, setFlightInfo] = useState({});

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/helper/cities"
        );
        setCities(data);
      } catch (error) {
        console.error(`Error fetching cities: ${error}`);
      }
    };

    //ex:
    //   {
    //     "flight_id": 2,
    //     "outbound_airport": "Dominguez-Turner Airport",
    //     "outbound_city": "Curtisburgh",
    //     "outbound_city_id": 29,
    //     "inbound_airport": "Lambert LLC Airport",
    //     "inbound_city": "Heatherview",
    //     "inbound_city_id": 1,
    //     "flight_departure_time": "2025-01-30T01:12:55.000Z",
    //     "airline_name": "Smith, Evans and Ryan",
    //     "is_delayed": 1
    // }
    const fetchFlights = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:3001/api/helper/flights"
        );
        // add a random price to each flight
        data.forEach((flight) => {
          flight.price = (Math.random() * 1000).toFixed(2);
        });
        setFlights(data);
        setFilteredFlights(data); // Initialize with all flights
      } catch (error) {
        console.error(`Error fetching flights: ${error}`);
      }
    };

    fetchCities();
    fetchFlights();
  }, []);

  useEffect(() => {
    setFilteredFlights(
      flights.filter(
        (flight) =>
          (!outboundCity ||
            flight.outbound_city_id.toString() === outboundCity) &&
          (!inboundCity || flight.inbound_city_id.toString() === inboundCity)
      )
    );
  }, [outboundCity, inboundCity, flights]);

  const cityOptions = useMemo(
    () =>
      cities.map((city) => (
        <option key={city.city_id} value={city.city_id}>
          {city.city_name} (
          {
            flights.filter((flight) => flight.outbound_city_id === city.city_id)
              .length
          }
          )
        </option>
      )),
    [cities, flights]
  );

  const handleButtonClick = (flight) => {
    setFlightInfo(flight);
  };

  const handleBookFlight = async (e) => {
    let flight = flightInfo;
    e.preventDefault();
    // get uid from local storage
    const uid = localStorage.getItem("uid");
    const token = localStorage.getItem("token");
    // post to /api/booking/book with flight_id, passenger_id or employee_id, seat_number (randomly generated), ticket price we have listed for that flight in the html below, is_working_flight BOOLEAN

    try {
      let seat_number = Math.floor(Math.random() * 100);
      const { data } = await axios.post(
        "http://localhost:3001/api/booking/book/flight",
        {
          token,
          flight_id: flight.flight_id,
          passenger_id: uid,
          seat_number: seat_number,
          ticket_price: flight.price,
          is_working_flight: false,
        }
      );
      //tell them success and give them their seat number and price
      alert(
        `Flight booked successfully! Your seat number is ${seat_number} and the ticket price is $${flight.price}`
      );
    } catch (error) {
      alert(`${error}}`);
      console.error(`Error booking flight: ${error}`);
    }
  };

  return (
    <div className="min-h-screen w-screen flex flex-col items-center">
      <Navbar signup={true} />
      <main className="min-w-full max-w-full w-full min-h-screen bg-[#f0f4f9] flex flex-col items-center justify-center align-middle">
        <div className="w-3/5 bg-white rounded-xl border shadow-lg p-6 mt-24 mx-auto mb-auto">
          <h2 className="text-3xl text-center text-primary mb-6">
            Book a Flight
          </h2>
          <form className="space-y-6" onSubmit={(e) => handleBookFlight(e)}>
            <div className="relative">
              <label
                htmlFor="outboundCitySelect"
                className="block text-primary mb-2"
              >
                Outbound City:
              </label>
              <select
                id="outboundCitySelect"
                value={outboundCity}
                onChange={(e) => setOutboundCity(e.target.value)}
                className="w-full pl-12 pr-5 py-3 border rounded focus:outline-none"
              >
                <option value="">Select Outbound City</option>
                {cityOptions}
              </select>
              <SlPlane className="absolute top-12 left-3 transform text-lg" />
            </div>
            <div className="relative">
              <label
                htmlFor="inboundCitySelect"
                className="block text-primary mb-2"
              >
                Inbound City:
              </label>
              <select
                id="inboundCitySelect"
                value={inboundCity}
                onChange={(e) => setInboundCity(e.target.value)}
                className="w-full pl-12 pr-5 py-3 border rounded focus:outline-none"
              >
                <option value="">Select Inbound City</option>
                {cityOptions}
              </select>
              <SlPlane className="absolute top-12 left-3 transform text-lg" />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Available Flights:</h3>
              {filteredFlights.length > 0 ? (
                filteredFlights.map((flight) => (
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
                        <strong>Inbound Airport:</strong>{" "}
                        {flight.inbound_airport}
                      </p>
                      <p>
                        <strong>Airline:</strong> {flight.airline_name}
                      </p>
                      <p>
                        <strong>Price:</strong> ${flight.price}
                      </p>
                    </div>

                    <button
                      className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                      type="submit"
                      onClick={() => handleButtonClick(flight)}
                    >
                      Book Flight
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-left">
                  No flights available for the selected cities.
                </p>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Booking;
