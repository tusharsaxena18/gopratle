import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({quiet: true});

const mongoUri = process.env.DB_URI;

if (!mongoUri) {
  throw new Error("DB_URI is not defined in .env file");
}

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(mongoUri);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};
