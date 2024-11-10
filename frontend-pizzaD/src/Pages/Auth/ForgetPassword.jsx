import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/auth/forgot-password", { email });
      alert(response.data.message);
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/auth/verify-otp", { email, otp });
      alert(response.data.message);
      setStep(3);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Update Password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8000/api/auth/update-password", { email, newPassword });
      alert(response.data.message);
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen bg-green-500 flex">
      <div className='w-[60%] h-full bg-[url("./Assets/login-pizza.jpg")] bg-right bg-cover'></div>
      <div className="w-[40%] h-full bg-[#FCF596] flex items-center justify-center">
        <form
          className="w-[80%] h-[60%] rounded-lg p-5 font-semibold"
          onSubmit={step === 1 ? handleSendOtp : step === 2 ? handleVerifyOtp : handleUpdatePassword}
        >
          <div className="w-full h-[20%] flex items-center justify-center">
            <h1 className="text-2xl font-semibold">
              {step === 1 && "Forgot Password"}
              {step === 2 && "Verify OTP"}
              {step === 3 && "Reset Password"}
            </h1>
          </div>

          {/* Step 1: Email Input */}
          {step === 1 && (
            <>
              <div className="w-full h-[20%] flex flex-col gap-2">
                <label htmlFor="email">Email address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full h-[60%] outline-none border-[1px] border-black rounded-md bg-gray-100 pl-2 pr-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-[10%] mt-2 bg-[#FF4545] rounded-md hover:bg-[#f92626] text-white transition-all ease-in-out"
                disabled={loading}
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </>
          )}

          {/* Step 2: OTP Verification */}
          {step === 2 && (
            <>
              <div className="w-full h-[20%] flex flex-col gap-2">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  className="w-full h-[60%] outline-none border-[1px] border-black rounded-md bg-gray-100 pl-2 pr-2"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-[10%] mt-2 bg-[#FF4545] rounded-md hover:bg-[#f92626] text-white transition-all ease-in-out"
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </>
          )}

          {/* Step 3: Update Password */}
          {step === 3 && (
            <>
              <div className="w-full h-[20%] flex flex-col gap-2">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full h-[60%] outline-none border-[1px] border-black rounded-md bg-gray-100 pl-2 pr-2"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full h-[10%] mt-2 bg-[#FF4545] rounded-md hover:bg-[#f92626] text-white transition-all ease-in-out"
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </>
          )}

          {/* Error message */}
          {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
