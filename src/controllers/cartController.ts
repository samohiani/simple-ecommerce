import { Request, Response } from "express";
import { CartService } from "../services/CartService";

export class CartController {
  public static async getCart(req: Request, res: Response) {
    const userId = (req as any).user._id;

    const { data, error, statusCode } = await CartService.getCartByUserId(
      userId
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async addToCart(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const { productId, quantity } = req.body;

    const { data, error, statusCode } = await CartService.addProductToCart(
      userId,
      productId,
      quantity
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  // New method for bulk adding products to cart
  public static async addProductsToCart(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const { products } = req.body;

    const { data, error, statusCode } = await CartService.addProductsToCart(
      userId,
      products
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async removeFromCart(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const { productId } = req.body;

    const { data, error, statusCode } = await CartService.removeProductFromCart(
      userId,
      productId
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async updateQuantity(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const { productId, quantity } = req.body;

    const { data, error, statusCode } = await CartService.updateProductQuantity(
      userId,
      productId,
      quantity
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async clearCart(req: Request, res: Response) {
    const userId = (req as any).user._id;

    const { data, error, statusCode } = await CartService.clearCart(userId);

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }
}
