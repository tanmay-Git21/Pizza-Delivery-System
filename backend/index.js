import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import connectDb from "./configs/connectDb.js";
import User from "./models/userModel.js";
import Otp from "./models/otpModel.js";

// Environment Configuration
dotenv.config();
const app = express();
const portNumber = process.env.PORT || 8000;

// Middleware
app.use(express.json());
app.use(cors());

// Connect to DB
connectDb(process.env.MONGODB_URI);

// Utility: Send OTP via Email
const sendOtp = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OTP for Password Reset",
    text: `Your OTP for resetting the password is: ${otp}`,
  };

  await transporter.sendMail(mailOptions);

  // Save OTP in DB
  await new Otp({ email, otp }).save();
  return otp;
};

// Routes

// User Registration Route
app.post("/api/auth/register", async (req, res) => {
  const { firstName, lastName, email, password, authority } = req.body;

  try {
    // Check if the user already exists
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user object
    const newUser = new User({
      firstName,
      lastName,
      email,
      authority,
      password: hashedPassword,
    });

    // Generate email verification token
    const emailVerificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET, // Secret key from environment variables
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Set expiration time for the token
    const emailVerificationTokenExpiration = new Date(Date.now() + 3600 * 1000); // 1 hour from now

    // Save the email verification token and expiration time to the user
    newUser.emailVerificationToken = emailVerificationToken;
    newUser.emailVerificationTokenExpiration = emailVerificationTokenExpiration;

    // Save the user in the database
    await newUser.save();

    // Send the email verification link
    const verificationLink = `http://localhost:8000/api/auth/verify-email/${emailVerificationToken}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Email Verification",
      text: `Click the link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);

    // Return response with message
    res.status(201).json({
      message:
        "User registered successfully. Please check your email to verify your account.",
    });
  } catch (error) {
    res.status(500).json({ message: "Error in registration", error });
  }
});

// Verify Email
app.get("/api/auth/verify-email/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.emailVerified = true;
    await user.save();
    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in email verification", error });
  }
});

// User Login
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.emailVerified) {
      return res.status(400).json({ message: "Email not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, authority: user.authority },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error in login", error });
  }
});

// Forgot Password (Send OTP)
app.post("/api/auth/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = await sendOtp(email);
    res.status(200).json({ message: "OTP sent to your email", otp });
  } catch (error) {
    res.status(500).json({ message: "Error in sending OTP", error });
  }
});

// Verify OTP
app.post("/api/auth/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  try {
    const otpRecord = await Otp.findOne({ email, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in verifying OTP", error });
  }
});

// Update Password
app.post("/api/auth/update-password", async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error in updating password", error });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Home Page");
});

// Start the Server
app.listen(portNumber, () => {
  console.log(`Server is running at http://localhost:${portNumber}`);
});
