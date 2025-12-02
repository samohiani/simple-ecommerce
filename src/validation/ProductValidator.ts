import Joi from "joi";

interface IProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export default class ProductValidator {
  public static validate(data: IProductInput): string | null {
    const schema = Joi.object({
      name: Joi.string().min(2).required(),
      description: Joi.string().required(),
      price: Joi.number().positive().required(),
      category: Joi.string().required(),
      imageUrl: Joi.string().uri().optional(),
    });

    const { error } = schema.validate(data);
    if (error) {
      return error.details[0].message.replace(/['"]/g, "");
    }
    return null;
  }
}
