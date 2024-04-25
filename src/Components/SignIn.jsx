import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (event) => {
    event.preventDefault();

    let result;

    try {
      result = await axios.post("http://localhost:3001/api/auth/signin", {
        email: email,
        password: password,
      });
    } catch (error) {
      setErrorMessage("An error occurred during signin. Please try again.");
      console.error(`Error: ${error}`);
    }
    console.log(result);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar signin={true} />
      {/* CONTAINER THAT CENTERS SIGNUP CONTAINER */}
      <main className="flex-grow bg-[#f0f4f9] relative flex flex-col justify-center align-top">
        {/* SIGNUP CONTAINER */}
        <div className="mx-auto mt-[150px] mb-auto py-[36px] w-full sm:w-[70%] bg-white rounded-[28px] border-2">
          <h2 className="text-3xl font-bold text-center text-primary mb-6 select-none">
            Sign In
          </h2>

          <form onSubmit={handleSignIn}>
            <div className="mb-4 relative w-[50%] mx-auto">
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

            <div className="flex flex-col justfiy-center align-middle w-[50%] mx-auto">
              <span className="relative select-none mr-auto">
                Not registered? <br />
                <Link to="/signin" className="underline text-blue-600">
                  Click here to sign up.
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

export default SignIn;
