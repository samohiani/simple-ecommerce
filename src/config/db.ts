import mongoose from "mongoose";
import config from "./env";

const connectDB = async (): Promise<void> => {
  try {
    mongoose.set("strictQuery", false);
    const mongoUrl = config.mongodbUri ?? "";
    await mongoose.connect(mongoUrl);
    console.log("Server Database Connected!!!");
  } catch (error: any) {
    console.error(error);
    throw error;
  }
};

export default connectDB;
