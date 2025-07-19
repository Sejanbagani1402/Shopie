import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27107/shopie"
    );

    console.log(`Mongo db connected: ${con.connection.host}`);
  } catch (error) {
    console.log(`Mongo DB connection error: ${error}`);
  }
};
