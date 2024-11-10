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
import Inventory from "./models/inventoryModel.js";
import Order from "./models/orderModel.js";
import PizzaOptions from "./models/pizzaOptionsModel.js"; // Model for pizza options

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

// --- Authentication Routes ---

// User Registration Route
app.post("/api/auth/register", async (req, res) => {
  const { firstName, lastName, email, password, authority } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      authority,
      password: hashedPassword,
    });

    const emailVerificationToken = jwt.sign(
      { email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const emailVerificationTokenExpiration = new Date(Date.now() + 3600 * 1000);
    newUser.emailVerificationToken = emailVerificationToken;
    newUser.emailVerificationTokenExpiration = emailVerificationTokenExpiration;

    await newUser.save();

    const verificationLink = `http://localhost:8000/api/auth/verify-email/${emailVerificationToken}`;

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
      subject: "Email Verification",
      text: `Click the link to verify your email: ${verificationLink}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      message: "User registered successfully. Please check your email to verify your account.",
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

// --- Pizza Options & Orders ---

// Get Pizza Options
app.get("/api/pizza-options", async (req, res) => {
  try {
    const options = await PizzaOptions.find();
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({ message: "Error fetching pizza options", error });
  }
});

// Place Order
app.post("/api/order", async (req, res) => {
  const { userId, pizzaDetails, paymentStatus } = req.body;

  try {
    const newOrder = new Order({
      userId,
      pizzaDetails,
      paymentStatus,
      status: "Order Received",
    });
    await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    res.status(500).json({ message: "Error placing order", error });
  }
});

// Get Order Status
app.get("/api/order-status/:orderId", async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error fetching order status", error });
  }
});

// Update Order Status (Admin Only)
app.patch("/api/order-status/:orderId", async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();
    res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
});

// --- Inventory Management (Admin Only) ---

// View Inventory
app.get("/api/inventory", async (req, res) => {
  const { adminId } = req.query;

  try {
    const inventory = await Inventory.findOne({ adminId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory", error });
  }
});

// Update Inventory Item
app.patch("/api/inventory/update", async (req, res) => {
  const { adminId, itemId, quantity } = req.body;

  try {
    const inventory = await Inventory.findOne({ adminId });
    if (!inventory) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    const item = inventory.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in inventory" });
    }

    item.quantity = quantity;
    await inventory.save();
    res.status(200).json({ message: "Inventory item updated successfully", item });
  } catch (error) {
    res.status(500).json({ message: "Error updating inventory", error });
  }
});

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Pizza Ordering API");
});

// Start the Server
app.listen(portNumber, () => {
  console.log(`Server is running at http://localhost:${portNumber}`);
});
