import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(""); // Reset any previous errors

    try {
      const response = await axios.post("http://localhost:8000/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // Handle successful registration
      alert("A verification email has been sent to your email. Please verify your account.");
      navigate("/");  // Redirect to the login page after successful registration

    } catch (error) {
      if (error.response) {
        setError(error.response.data.message); // Extract error message from the response
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-red-500 flex">
      <div className="w-[60%] h-full bg-[url('./Assets/login-pizza.jpg')] bg-right bg-cover"></div>
      <div className="w-[40%] h-full bg-[#FCF596] flex items-center justify-center">
        <form
          className="w-[80%] h-[60%] rounded-lg p-5 font-semibold"
          onSubmit={handleSubmit}
        >
          <div className="w-full h-[20%] flex gap-2 items-center justify-center">
            <h1 className="text-2xl font-semibold">Create a new account</h1>
          </div>

          {/* First Name Field */}
          <div className="w-full h-[20%] flex gap-1">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="w-full h-[60%] outline-none border-[1px] border-black rounded-md bg-gray-100 pl-2 pr-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="w-full h-[60%] outline-none border-[1px] border-black rounded-md bg-gray-100 pl-2 pr-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          {/* Email Field */}
          <div className="w-full h-[20%] flex flex-col gap-2">
            <label htmlFor="email">Email address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full h-[60%] outline-none border-[1px] border-black rounded-md bg-gray-100 pl-2 pr-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="w-full h-[20%] flex flex-col gap-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full h-[60%] outline-none border-[1px] border-black rounded-md bg-gray-100 pl-2 pr-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="text-red-500 text-center mt-2">{error}</div>
          )}

          {/* Register Button */}
          <div className="w-full h-[10%] mt-2">
            <button
              type="submit"
              className="w-full h-full bg-[#FF4545] rounded-md hover:bg-[#f92626] text-white transition-all ease-in-out"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>

          {/* Login Link */}
          <div className="w-full h-[20%] flex items-center justify-center mt-5">
            <h1>
              Already a member?{" "}
              <a className="text-[#FF4545] font-semibold cursor-pointer" href="/">
                Login
              </a>
            </h1>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
