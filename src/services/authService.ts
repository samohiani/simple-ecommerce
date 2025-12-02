import { generateToken } from "../utils/jwtUtils";
import { IUser } from "../interfaces/IUser";

const generateUserToken = (user: IUser | string): string => {
  if (typeof user === "string") {
    return generateToken({ id: user, email: "" });
  } else {
    return generateToken({ id: user._id.toString(), email: user.email });
  }
};

export { generateUserToken };
