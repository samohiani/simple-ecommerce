import * as dotenv from "dotenv";
dotenv.config();

export default {
  port: process.env.PORT,
  mongodbUri: process.env.MONGODB_URI,
  secret: process.env.JWT_SECRET as string,
};
