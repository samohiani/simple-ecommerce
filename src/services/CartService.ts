import Cart from "../models/Cart";
import Product from "../models/Product";
import { Types } from "mongoose";

interface ServiceResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export class CartService {
  public static async getCartByUserId(
    userId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate user ID
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      let cart = await Cart.findOne({ user: userId }).populate(
        "products.product"
      );

      if (!cart) {
        // Create a new empty cart if none exists
        cart = new Cart({
          user: userId,
          products: [],
          totalAmount: 0,
        });
        await cart.save();
      }

      return { data: cart, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async addProductToCart(
    userId: string,
    productId: string,
    quantity: number = 1
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      if (!productId) {
        return { error: "Product ID is required", statusCode: 400 };
      }

      if (quantity <= 0) {
        return { error: "Quantity must be greater than 0", statusCode: 400 };
      }

      // Check if product exists
      const product = await Product.findById(productId);
      if (!product) {
        return { error: "Product not found", statusCode: 404 };
      }

      // Find or create cart
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({
          user: userId,
          products: [],
          totalAmount: 0,
        });
      }

      // Check if product already in cart
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (existingProductIndex > -1) {
        // Update quantity
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        // Add new product
        cart.products.push({
          product: new Types.ObjectId(productId),
          quantity,
        });
      }

      // Recalculate total amount
      cart.totalAmount = 0;
      for (const item of cart.products) {
        const product = await Product.findById(item.product);
        if (product) {
          cart.totalAmount += product.price * item.quantity;
        }
      }

      await cart.save();

      // Populate product details
      await cart.populate("products.product");

      return { data: cart, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  // New method for bulk adding products to cart
  public static async addProductsToCart(
    userId: string,
    products: { productId: string; quantity: number }[]
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      if (!products || !Array.isArray(products) || products.length === 0) {
        return {
          error: "Products array is required and cannot be empty",
          statusCode: 400,
        };
      }

      // Validate each product in the array
      for (const item of products) {
        if (!item.productId) {
          return {
            error: "Each product must have a productId",
            statusCode: 400,
          };
        }

        if (item.quantity <= 0) {
          return {
            error: "Each product quantity must be greater than 0",
            statusCode: 400,
          };
        }

        // Check if product exists
        const product = await Product.findById(item.productId);
        if (!product) {
          return {
            error: `Product with ID ${item.productId} not found`,
            statusCode: 404,
          };
        }
      }

      // Find or create cart
      let cart = await Cart.findOne({ user: userId });
      if (!cart) {
        cart = new Cart({
          user: userId,
          products: [],
          totalAmount: 0,
        });
      }

      // Add each product to cart
      for (const item of products) {
        // Check if product already in cart
        const existingProductIndex = cart.products.findIndex(
          (cartItem) => cartItem.product.toString() === item.productId
        );

        if (existingProductIndex > -1) {
          // Update quantity
          cart.products[existingProductIndex].quantity += item.quantity;
        } else {
          // Add new product
          cart.products.push({
            product: new Types.ObjectId(item.productId),
            quantity: item.quantity,
          });
        }
      }

      // Recalculate total amount
      cart.totalAmount = 0;
      for (const item of cart.products) {
        const product = await Product.findById(item.product);
        if (product) {
          cart.totalAmount += product.price * item.quantity;
        }
      }

      await cart.save();

      // Populate product details
      await cart.populate("products.product");

      return { data: cart, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async removeProductFromCart(
    userId: string,
    productId: string
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      if (!productId) {
        return { error: "Product ID is required", statusCode: 400 };
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return { error: "Cart not found", statusCode: 404 };
      }

      // Filter out the product
      cart.products = cart.products.filter(
        (item) => item.product.toString() !== productId
      );

      // Recalculate total amount
      cart.totalAmount = 0;
      for (const item of cart.products) {
        const product = await Product.findById(item.product);
        if (product) {
          cart.totalAmount += product.price * item.quantity;
        }
      }

      await cart.save();

      // Populate product details
      await cart.populate("products.product");

      return { data: cart, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async updateProductQuantity(
    userId: string,
    productId: string,
    quantity: number
  ): Promise<ServiceResponse<any>> {
    try {
      // Validate inputs
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      if (!productId) {
        return { error: "Product ID is required", statusCode: 400 };
      }

      if (quantity <= 0) {
        return { error: "Quantity must be greater than 0", statusCode: 400 };
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return { error: "Cart not found", statusCode: 404 };
      }

      // Find product in cart
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === productId
      );

      if (productIndex === -1) {
        return { error: "Product not found in cart", statusCode: 404 };
      }

      // Update quantity
      cart.products[productIndex].quantity = quantity;

      // Recalculate total amount
      cart.totalAmount = 0;
      for (const item of cart.products) {
        const product = await Product.findById(item.product);
        if (product) {
          cart.totalAmount += product.price * item.quantity;
        }
      }

      await cart.save();

      // Populate product details
      await cart.populate("products.product");

      return { data: cart, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async clearCart(userId: string): Promise<ServiceResponse<any>> {
    try {
      // Validate user ID
      if (!userId) {
        return { error: "User ID is required", statusCode: 400 };
      }

      const cart = await Cart.findOne({ user: userId });
      if (!cart) {
        return { error: "Cart not found", statusCode: 404 };
      }

      cart.products = [];
      cart.totalAmount = 0;

      await cart.save();

      return { data: cart, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }
}
