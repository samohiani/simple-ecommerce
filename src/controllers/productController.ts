import { Request, Response } from "express";
import ProductValidator from "../validation/ProductValidator";
import { ProductService } from "../services/ProductService";
import { IGetProductsFilter } from "../interfaces/IProduct";

export class ProductController {
  public static async getProducts(req: Request, res: Response) {
    const filter: IGetProductsFilter = {
      page: parseInt(req.query.page as string, 10) || undefined,
      limit: parseInt(req.query.limit as string, 10) || undefined,
      category: req.query.category as string,
      search: req.query.search as string,
      sort: req.query.sort as string,
    };

    const { data, error, statusCode } = await ProductService.getAllProducts(
      filter
    );

    if (error) {
      return res.status(statusCode || 500).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async getProductById(req: Request, res: Response) {
    const { id } = req.params;

    const { data, error, statusCode } = await ProductService.getProductById(id);

    if (error) {
      return res.status(statusCode || 404).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async createProduct(req: Request, res: Response) {
    const { name, price, description, category, imageUrl } = req.body;

    // Validate product data
    const validationError = ProductValidator.validate({
      name,
      price,
      description,
      category,
      imageUrl,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const { data, error, statusCode } = await ProductService.createProduct({
      name,
      price,
      description,
      category,
      imageUrl,
    });

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 201).json(data);
  }

  public static async updateProduct(req: Request, res: Response) {
    const { id } = req.body;
    const { name, price, description, category, imageUrl } = req.body;

    // Validate product data if provided
    const productData: any = {};
    if (name !== undefined) productData.name = name;
    if (price !== undefined) productData.price = price;
    if (description !== undefined) productData.description = description;
    if (category !== undefined) productData.category = category;
    if (imageUrl !== undefined) productData.imageUrl = imageUrl;

    if (Object.keys(productData).length === 0) {
      return res
        .status(400)
        .json({ message: "At least one field is required for update" });
    }

    const { data, error, statusCode } = await ProductService.updateProduct(
      id,
      productData
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async deleteProduct(req: Request, res: Response) {
    const { id } = req.body;

    const { data, error, statusCode } = await ProductService.deleteProduct(id);

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }
}
