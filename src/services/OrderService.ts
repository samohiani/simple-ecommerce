import Order from "../models/Order";
import Cart from "../models/Cart";

interface ServiceResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export class OrderService {
  public static async createOrderFromCart(
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate user ID
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      // Get user's cart
      const cart = await Cart.findOne({ user: userId }).populate(
        "products.product"
      );

      if (!cart || cart.products.length === 0) {
        return { error: "Cart is empty", statusCode: 400 };
      }

      // Validate products and calculate total
      let totalAmount = 0;
      const orderProducts = [];

      for (const item of cart.products) {
        const product = item.product as any;
        if (!product) {
          return {
            error: `Product not found: ${item.product}`,
            statusCode: 404,
          };
        }

        // Check if product has enough stock (if you implement stock tracking)
        totalAmount += product.price * item.quantity;

        orderProducts.push({
          product: product._id,
          quantity: item.quantity,
          price: product.price,
        });
      }

      // Create order
      const order = new Order({
        user: userId,
        products: orderProducts,
        totalAmount,
        status: "pending",
      });

      await order.save();

      // Clear cart after order creation
      cart.products = [];
      cart.totalAmount = 0;
      await cart.save();

      // Populate order details
      await order.populate("user", "name email");
      await order.populate("products.product", "name price");

      return { data: order, statusCode: 201 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async getOrdersByUserId(
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate user ID
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      const orders = await Order.find({ user: userId })
        .populate("products.product", "name price")
        .sort({ createdAt: -1 });

      return { data: orders, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async getOrderById(
    orderId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs
      if (!orderId) {
        return { error: "Order ID is required", statusCode: 400 };
      }

      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      const order = await Order.findOne({
        _id: orderId,
        user: userId,
      }).populate([
        { path: "user", select: "name email" },
        { path: "products.product", select: "name price" },
      ]);

      if (!order) {
        return { error: "Order not found", statusCode: 404 };
      }

      return { data: order, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  // New method to update order status (only pending orders can be updated)
  public static async updateOrderStatus(
    orderId: string,
    userId: string,
    status: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs
      if (!orderId) {
        return { error: "Order ID is required", statusCode: 400 };
      }

      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      if (!status) {
        return { error: "Status is required", statusCode: 400 };
      }

      // Validate status value
      const validStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
      ];
      if (!validStatuses.includes(status)) {
        return {
          error: `Invalid status. Valid statuses are: ${validStatuses.join(
            ", "
          )}`,
          statusCode: 400,
        };
      }

      // Find the order
      const order = await Order.findOne({ _id: orderId, user: userId });

      if (!order) {
        return { error: "Order not found", statusCode: 404 };
      }

      // Only pending orders can be updated by users
      if (order.status !== "pending") {
        return {
          error: `Cannot update order with status '${order.status}'. Only pending orders can be modified.`,
          statusCode: 400,
        };
      }

      // Update order status
      order.status = status as
        | "pending"
        | "processing"
        | "shipped"
        | "delivered"
        | "cancelled";
      await order.save();

      // Populate order details
      await order.populate("user", "name email");
      await order.populate("products.product", "name price");

      return { data: order, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  // New method to cancel an order (only pending orders can be cancelled)
  public static async cancelOrder(
    orderId: string,
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs
      if (!orderId) {
        return { error: "Order ID is required", statusCode: 400 };
      }

      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      // Find the order
      const order = await Order.findOne({ _id: orderId, user: userId });

      if (!order) {
        return { error: "Order not found", statusCode: 404 };
      }

      // Only pending orders can be cancelled
      if (order.status !== "pending") {
        return {
          error: `Cannot cancel order with status '${order.status}'. Only pending orders can be cancelled.`,
          statusCode: 400,
        };
      }

      // Update order status to cancelled
      order.status = "cancelled";
      await order.save();

      // Populate order details
      await order.populate("user", "name email");
      await order.populate("products.product", "name price");

      return { data: order, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }
}
