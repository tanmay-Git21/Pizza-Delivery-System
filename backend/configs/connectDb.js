import mongoose from "mongoose";

const connectDb = async (uri) => {
  try {
    if (!uri) {
      console.error("MongoDB URI is missing");
      return;
    }
    const connection = await mongoose.connect(uri);
    console.log("Connected to DB:", connection.connection.name);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

export default connectDb;
