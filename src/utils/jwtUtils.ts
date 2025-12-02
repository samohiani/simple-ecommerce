import jwt from "jsonwebtoken";
import config from "../config/env";

interface JwtPayload {
  id: string;
  email?: string;
}

const generateToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, config.secret, {
    expiresIn: "30d",
  });
};

const verifyToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, config.secret) as JwtPayload;
  } catch (error) {
    return null;
  }
};

export { generateToken, verifyToken, type JwtPayload };
