import Joi from "joi";

interface ILoginInput {
  email: string;
  password: string;
}

interface IRegisterInput {
  name: string;
  email: string;
  password: string;
}

export default class AuthValidator {
  public static login(data: ILoginInput): string | null {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message.replace(/['"]/g, "");
    }
    return null;
  }

  public static register(data: IRegisterInput): string | null {
    const schema = Joi.object({
      name: Joi.string().min(2).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message.replace(/['"]/g, "");
    }
    return null;
  }
}
