import { Request, Response } from "express";
import AuthValidator from "../validation/AuthValidator";
import { UserService } from "../services/UserService";

export class UserController {
  public static async registerUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    // Validate user input
    const validationError = AuthValidator.register({ name, email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { data, error, statusCode } = await UserService.registerUser(
      name,
      email,
      password
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 201).json(data);
  }

  public static async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    // Validate user input
    const validationError = AuthValidator.login({ email, password });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { data, error, statusCode } = await UserService.loginUser(
      email,
      password
    );

    if (error) {
      return res.status(statusCode || 401).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async getUserProfile(req: Request, res: Response) {
    const userId = (req as any).user._id;

    const { data, error, statusCode } = await UserService.getUserById(userId);

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }
}
