import User from "../models/User";
import { hashPassword, comparePasswords } from "../utils/passwordUtils";
import { generateUserToken } from "../services/authService";
import AuthValidator from "../validation/AuthValidator";

interface ServiceResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export class UserService {
  public static async registerUser(
    name: string,
    email: string,
    password: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs using Joi
      const validationError = AuthValidator.register({ name, email, password });
      if (validationError) {
        return { error: validationError, statusCode: 400 };
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return {
          error: "User already exists with this email",
          statusCode: 400,
        };
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = new User({
        name,
        email,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      // Generate token
      const token = generateUserToken(savedUser);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = savedUser.toObject();

      return {
        data: {
          user: userWithoutPassword,
          token,
        },
        statusCode: 201,
      };
    } catch (error: any) {
      // Handle validation errors
      if (error.name === "ValidationError") {
        const messages = Object.values(error.errors).map(
          (err: any) => err.message as string
        );
        return { error: messages.join(", "), statusCode: 400 };
      }

      return { error: error.message, statusCode: 500 };
    }
  }

  public static async loginUser(
    email: string,
    password: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs using Joi
      const validationError = AuthValidator.login({ email, password });
      if (validationError) {
        return { error: validationError, statusCode: 400 };
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return { error: "Invalid credentials", statusCode: 401 };
      }

      // Check password
      const isMatch = await comparePasswords(password, user.password);
      if (!isMatch) {
        return { error: "Invalid credentials", statusCode: 401 };
      }

      // Generate token
      const token = generateUserToken(user);

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();

      return {
        data: {
          user: userWithoutPassword,
          token,
        },
        statusCode: 200,
      };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async getUserById(
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate user ID
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      const user = await User.findById(userId);
      if (!user) {
        return { error: "User not found", statusCode: 404 };
      }

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user.toObject();

      return { data: userWithoutPassword, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }
}
