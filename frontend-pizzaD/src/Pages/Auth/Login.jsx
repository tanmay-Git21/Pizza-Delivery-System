import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {


  const navigate = useNavigate();
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
      const response = await axios.post("http://localhost:8000/api/auth/login", { email, password });
      
      // Save the JWT token in localStorage or cookies if login is successful
      localStorage.setItem("token", response.data.token);

        navigate("/dashboard")// Or wherever you'd like to redirect

    } catch (error) {
      // Handle error (e.g., invalid credentials or other issues)
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
    <div className="w-full h-screen bg-green-500 flex">
      <div className='w-[60%] h-full bg-[url("./Assets/login-pizza.jpg")] bg-right bg-cover '></div>
      <div className="w-[40%] h-full bg-[#FCF596] flex items-center justify-center">
        <form
          className="w-[80%] h-[70%] rounded-lg p-5 font-semibold"
          onSubmit={handleSubmit}
        >
          <div className="w-full h-[20%] flex items-center justify-center">
            <h1 className="text-2xl font-semibold">Sign in to your account</h1>
          </div>

          {/* Email Field */}
          <div className="w-full h-[20%] flex flex-col gap-2">
            <label htmlFor="email" className="">
              Email address
            </label>
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="">
                Password
              </label>
              <a className="text-[#FF4545] cursor-pointer" href="/forgot-password">Forgot password?</a>
            </div>
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

          {/* Sign In Button */}
          <div className="w-full h-[10%] mt-2">
            <button
              type="submit"
              className="w-full h-full bg-[#FF4545] rounded-md hover:bg-[#f92626] text-white transition-all ease-in-out"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="w-full h-[20%] flex items-center justify-center mt-5">
            <h1>
              Not a member?{" "}
              <a className="text-[#FF4545] font-semibold cursor-pointer" href="/register">
                Sign up
              </a>
            </h1>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
