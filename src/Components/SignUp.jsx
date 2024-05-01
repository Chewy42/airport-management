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
import "./SignUp.css";
import { BsGenderAmbiguous } from "react-icons/bs";
import { SlPlane } from "react-icons/sl";
import { FaBaby } from "react-icons/fa";
import { isElement } from "react-dom/test-utils";
import { AuthContext } from "../Contexts/AuthContext";

const SignUp = () => {
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
  const [selectedAirport, setSelectedAirport] = useState("");
  const [filteredAirports, setFilteredAirports] = useState([]);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    if (rendered) return;
    const fetchAirlines = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/helper/airlines"
        );
        console.log(response.data);
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
        console.log(response.data);
        setAirports(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    const filterAirportsByAirline = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/helper/airports?airline=${selectedAirline}`
        );
        console.log(response.data);
        setFilteredAirports(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    const fetchData = () => {
      fetchAirlines();
      fetchAirports();
    };

    if (!rendered) {
      fetchData();
      setRendered(true);
    }
  }, [rendered]);

  useEffect(() => {
    const filterAirports = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/helper/airports?airline=${selectedAirline}`
        );
        console.log(response.data);
        setFilteredAirports(response.data);
      } catch (error) {
        console.error(`Error: ${error}`);
      }
    };

    if (selectedAirline !== "Select") {
      filterAirports();
    }
  }, [selectedAirline]);

  const handleSignup = async (event) => {
    event.preventDefault();

    let result;

    if (isEmployee === true) {
      const airlineId = airlines.find(
        (airline) => airline.airline_name === selectedAirline
      ).airline_id;

      const airportId = airports.find(
        (airport) => airport.airport_name === selectedAirport
      ).airport_id;

      const reqbody = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password,
        jobTitle: jobTitle,
        salary: salary,
        airlineId: airlineId,
        airportId: airportId,
        ssn: ssn,
      };

      console.log(reqbody);

      try {
        result = await axios.post(
          "http://localhost:3001/api/auth/signup/employee",
          reqbody
        );
        if (result.status === 200) {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("userType", "employee");
          localStorage.setItem("email", email);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setErrorMessage("An error occurred during signup. Please try again.");
        console.error(`Error: ${error}`);
      }
    } else {
      try {
        result = await axios.post(
          "http://localhost:3001/api/auth/signup/passenger",
          {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            age: age,
            sex: sex,
            phoneNumber: phoneNumber,
          }
        );
        console.log(result.data);

        if (result.status === 200) {
          localStorage.setItem("token", result.data.token);
          localStorage.setItem("userType", "passenger");
          localStorage.setItem("email", email);
          setIsAuthenticated(true);
        }
      } catch (error) {
        setErrorMessage("An error occurred during signup. Please try again.");
        console.error(`Error: ${error}`);
      }
    }
    console.log("reached", isEmployee);
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
            Sign Up
          </h2>

          <form onSubmit={handleSignup}>
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
            {isEmployee && (
              <div className="my-4 relative w-[50%] mx-auto">
                <label
                  htmlFor="name"
                  className="block text-primary font-semibold mb-2 select-none"
                >
                  Airline:
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
            )}

            {isEmployee && selectedAirline !== "Select" ? (
              <div className="my-4 relative w-[50%] mx-auto">
                <label
                  htmlFor="name"
                  className="block text-primary font-semibold mb-2 select-none"
                >
                  Airport:
                </label>

                <select
                  onChange={(e) => {
                    setSelectedAirport(e.target.value);
                  }}
                  className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
                >
                  <option value="Select">Select</option>
                  {filteredAirports.map((airport) => (
                    <option
                      key={airport.airport_name}
                      value={airport.airport_name}
                    >
                      {airport.airport_name}
                    </option>
                  ))}
                </select>

                <SlPlane className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
              </div>
            ) : null}

            <div className="relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                First Name:
              </label>

              <input
                type="text"
                id="firstname"
                onChange={(e) => {
                  setFirstName(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />

              <AiOutlineUser className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Last Name:
              </label>

              <input
                type="text"
                id="lastname"
                onChange={(e) => {
                  setLastName(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />

              <AiOutlineUser className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Age:
              </label>

              <input
                type="number"
                onChange={(e) => {
                  setAge(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />

              <AiOutlineLineChart className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Sex:
              </label>

              <select
                onChange={(e) => {
                  setSex(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              >
                <option value="Select">Select</option>
                <option value="M">Male</option>
                <option value="F">Female</option>
              </select>

              <BsGenderAmbiguous className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="email"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Email:
              </label>

              <input
                type="email"
                id="email"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />
              <AiOutlineMail className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="phone_number"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Phone Number:
              </label>

              <input
                type="number"
                maxLength={10}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />

              <AiOutlinePhone className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>
            {isEmployee && (
              <div className="my-4 relative w-[50%] mx-auto">
                <label
                  htmlFor="name"
                  className="block text-primary font-semibold mb-2 select-none"
                >
                  Job Title:
                </label>

                <input
                  type="text"
                  id="jobtitle"
                  onChange={(e) => {
                    setJobTitle(e.target.value);
                  }}
                  className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
                />

                <AiOutlineUser className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
              </div>
            )}

            {isEmployee && (
              <div className="my-4 relative w-[50%] mx-auto">
                <label
                  htmlFor="ssn"
                  className="block text-primary font-semibold mb-2 select-none"
                >
                  SSN:
                </label>

                <input
                  type="number"
                  maxLength={9}
                  onChange={(e) => {
                    setSsn(e.target.value);
                  }}
                  className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
                />

                <AiOutlineCreditCard className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
              </div>
            )}

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="password"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Password:
              </label>

              <input
                type="password"
                id="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />
              <AiOutlineLock className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="password"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Confirm Password:
              </label>

              <input
                type="password"
                onChange={(e) => {
                  console.log("changed");
                }}
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />
              <AiOutlineLock className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="flex flex-col justfiy-center align-middle w-[50%] mx-auto">
              <span className="relative select-none mr-auto">
                Already registered? <br />
                <Link to="/signin" className="underline text-blue-600">
                  Click here to sign in.
                </Link>
              </span>

              <button
                type="submit"
                className="select-none bg-green-500 hover:scale-[103%] transition-all ease-linear duration-200 text-white font-medium px-6 py-3 mt-4 rounded-md shadow-md w-[100%] mx-auto hover:shadow-xl"
              >
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default SignUp;
