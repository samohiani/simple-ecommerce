import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import { verifyToken } from "../utils/jwtUtils";

const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer")) {
      return res.status(401).json({ message: "Invalid Token Provided" });
    }

    const [, token] = authorization.split(" ");

    if (!token) {
      return res.status(401).json({ message: "Invalid Token Provided" });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export { authenticate };
