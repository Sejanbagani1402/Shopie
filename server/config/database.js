import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const con = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27107/shopie",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`Mongo db connected: ${con.connection.host}`);
  } catch (error) {
    console.log(`Mongo DB connection error: ${error}`);
  }
};
