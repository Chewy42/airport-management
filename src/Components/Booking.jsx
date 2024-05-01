import {
  AiOutlineCreditCard,
  AiOutlineLineChart,
  AiOutlineLock,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import { BsGenderAmbiguous } from "react-icons/bs";
import { SlPlane } from "react-icons/sl";
import { FaBaby } from "react-icons/fa";
import { isElement } from "react-dom/test-utils";
import { AuthContext } from "../Contexts/AuthContext";

const Booking = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("M"); // M or F
  const [jobTitle, setJobTitle] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [ssn, setSsn] = useState("");
  const [salary, setSalary] = useState("0");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmployee, setIsEmployee] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { setIsAuthenticated } = useContext(AuthContext);

  const [airlines, setAirlines] = useState([]);
  const [selectedAirline, setSelectedAirline] = useState("");
  const [airports, setAirports] = useState([]);
  const [outboundAirport, setOutboundAirport] = useState({});
  const [inboundAirport, setInboundAirport] = useState({});
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [cities, setCities] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (rendered) return;
    const fetchAirlines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/helper/airlines"
        );

        setAirlines(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    const fetchAirports = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/helper/airports"
        );

        setAirports(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    const fetchCities = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/helper/cities"
        );
        console.log(response.data);
        setCities(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    const fetchData = () => {
      fetchAirlines();
      fetchAirports();
      fetchCities();
    };

    if (!rendered) {
      fetchData();
      setRendered(true);
    }
  }, [rendered]);

  const handleClick = async (e) => {
    e.preventDefault();
    let outbound_airport_id = outboundAirport.airport_id;
    let inbound_airport_id = inboundAirport.airport_id;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar signup={true} />
      <main className="flex-grow bg-[#f0f4f9] relative flex flex-col justify-center align-top">
        <div className="mx-auto mt-[150px] mb-auto py-[36px] w-full sm:w-[70%] bg-white rounded-[28px] border-2">
          {/* Error Message Display */}
          {/* {errorMessage && (
              <div className="px-4 py-2 bg-red-500 text-white text-sm rounded-md absolute top-20 left-1/2 transform -translate-x-1/2">
                {errorMessage}
              </div>
            )} */}
          <h2 className="text-3xl font-bold text-center text-primary mb-6 select-none">
            Book a Flight
          </h2>

          <form onSubmit={handleClick}>
            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Which Airline are you flying with?:
              </label>

              <select
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
                onChange={(e) => {
                  setSelectedAirline(e.target.value);
                }}
              >
                <option value="Select">Select</option>
                {airlines.map((airline) => (
                  <option
                    key={airline.airline_name}
                    value={airline.airline_name}
                  >
                    {airline.airline_name}
                  </option>
                ))}
              </select>

              <SlPlane className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                What City Are You Flying From?:
              </label>

              <select className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black">
                <option value="Select">Select</option>
                {cities.map((city) => (
                  <option key={city.city_name} value={city.city_name}>
                    {city.city_name}
                  </option>
                ))}
              </select>

              <SlPlane className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                What City Are You Flying To?:
              </label>

              <select className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black">
                <option value="Select">Select</option>
                {cities.map((city) => (
                  <option key={city.city_name} value={city.city_name}>
                    {city.city_name}
                  </option>
                ))}
              </select>

              <SlPlane className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto flex justify-start align-middle">
              <label
                htmlFor="password"
                className="text-primary font-medium select-none"
              >
                Are you an employee?:
              </label>

              <input
                type="checkbox"
                onChange={(e) => {
                  setIsEmployee(!isEmployee);
                }}
                defaultChecked={false}
                className="ml-2 border-2 focus:outline-none focus:border-black"
              />
              <p className="font-medium ml-1">
                {isEmployee ? "Yes, I am an Employee." : "No"}
              </p>
            </div>

            <div className="flex flex-col justfiy-center align-middle w-[50%] mx-auto">
              <button
                type="submit"
                className="select-none bg-green-500 hover:scale-[103%] transition-all ease-linear duration-200 text-white font-medium px-6 py-3 mt-4 rounded-md shadow-md w-[100%] mx-auto hover:shadow-xl"
              >
                Book Flight
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Booking;
