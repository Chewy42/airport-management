import {
  AiFillClockCircle,
  AiOutlineCalendar,
  AiOutlineLineChart,
  AiOutlineLock,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineUser,
} from "react-icons/ai";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import "./SignUp.css";
import { PiPersonArmsSpread } from "react-icons/pi";
import { FaBaby } from "react-icons/fa6";
import { BsGenderAmbiguous } from "react-icons/bs";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmployee, setIsEmployee] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async (event) => {
    event.preventDefault();

    let result;

    try {
      result = await axios.post("http://localhost:3001/api/auth/signup", {
        name: name,
        email: email,
        password: password,
      });
    } catch (error) {
      setErrorMessage("An error occurred during signup. Please try again.");
      console.error(`Error: ${error}`);
    }
    console.log(result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar signup={true} />
      {/* CONTAINER THAT CENTERS SIGNUP CONTAINER */}
      <main className="flex-grow bg-[#f0f4f9] relative flex flex-col justify-center align-top">
        {/* SIGNUP CONTAINER */}
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
            <div className="relative w-[50%] mx-auto">
              <label
                htmlFor="name"
                className="block text-primary font-semibold mb-2 select-none"
              >
                First Name:
              </label>

              <input
                type="text"
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
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
                id="name"
                onChange={(e) => {
                  setName(e.target.value);
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

              <select className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black">
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
                className="w-full pl-9 pr-5 py-2 border-2  rounded focus:outline-none focus:border-black"
              />

              <AiOutlinePhone className="absolute top-[44px] left-[10px] w-[20px] h-auto" />
            </div>

            <div className="my-4 relative w-[50%] mx-auto">
              <label
                htmlFor="password"
                className="block text-primary font-semibold mb-2 select-none"
              >
                Password:
              </label>

              <input
                type="email"
                id="email"
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
