import { Request, Response } from "express";
import { OrderService } from "../services/OrderService";

export class OrderController {
  public static async createOrder(req: Request, res: Response) {
    const userId = (req as any).user._id;

    const { data, error, statusCode } = await OrderService.createOrderFromCart(
      userId
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 201).json(data);
  }

  public static async getOrders(req: Request, res: Response) {
    const userId = (req as any).user._id;

    const { data, error, statusCode } = await OrderService.getOrdersByUserId(
      userId
    );

    if (error) {
      return res.status(statusCode || 500).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async getOrderById(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const { id: orderId } = req.params;

    const { data, error, statusCode } = await OrderService.getOrderById(
      orderId,
      userId
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async updateOrderStatus(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const { id: orderId } = req.params;
    const { status } = req.body;

    const { data, error, statusCode } = await OrderService.updateOrderStatus(
      orderId,
      userId,
      status
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }

  public static async cancelOrder(req: Request, res: Response) {
    const userId = (req as any).user._id;
    const { id: orderId } = req.params;

    const { data, error, statusCode } = await OrderService.cancelOrder(
      orderId,
      userId
    );

    if (error) {
      return res.status(statusCode || 400).json({ message: error });
    }

    return res.status(statusCode || 200).json(data);
  }
}
