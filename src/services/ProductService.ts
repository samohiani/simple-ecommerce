import Product from "../models/Product";
import { IGetProductsFilter } from "../interfaces/IProduct";

interface ServiceResponse<T> {
  data?: T;
  error?: string;
  statusCode?: number;
}

export class ProductService {
  public static async getAllProducts(filter: IGetProductsFilter = {}) {
    try {
      const { page = 1, limit = 10, category, search, sort } = filter;

      // Validate pagination parameters
      if (page < 1) {
        return { error: "Page must be greater than 0", statusCode: 400 };
      }

      if (limit < 1 || limit > 100) {
        return { error: "Limit must be between 1 and 100", statusCode: 400 };
      }

      const filterQuery: any = {};

      // Add category filter if provided
      if (category) {
        filterQuery.category = category;
      }

      // Add search filter if provided
      if (search) {
        filterQuery.$or = [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ];
      }

      // Format sort filter
      const sortQuery: any = {};
      if (sort) {
        const sortFields = sort.split(",");
        for (const field of sortFields) {
          if (field.startsWith("-")) {
            sortQuery[field.substring(1)] = -1;
          } else {
            sortQuery[field] = 1;
          }
        }
      } else {
        // Default sort by createdAt descending
        sortQuery.createdAt = -1;
      }

      const products = await Product.find(filterQuery)
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(sortQuery)
        .exec();

      const count = await Product.countDocuments(filterQuery);

      return {
        data: {
          products,
          totalPages: Math.ceil(count / limit),
          currentPage: page,
          totalProducts: count,
        },
        statusCode: 200,
      };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async getProductById(id: string) {
    try {
      // Validate ID
      if (!id) {
        return { error: "Product ID is required", statusCode: 400 };
      }

      const product = await Product.findById(id);

      if (!product) {
        return { error: "Product not found", statusCode: 404 };
      }

      return { data: product, statusCode: 200 };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }

  public static async createProduct(productData: any) {
    try {
      // Validate product data
      if (!productData.name) {
        return { error: "Product name is required", statusCode: 400 };
      }

      if (!productData.description) {
        return { error: "Product description is required", statusCode: 400 };
      }

      if (productData.price === undefined || productData.price === null) {
        return { error: "Product price is required", statusCode: 400 };
      }

      if (productData.price <= 0) {
        return {
          error: "Product price must be greater than 0",
          statusCode: 400,
        };
      }

      if (!productData.category) {
        return { error: "Product category is required", statusCode: 400 };
      }

      const product = new Product(productData);
      const savedProduct = await product.save();

      return { data: savedProduct, statusCode: 201 };
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

  public static async updateProduct(id: string, productData: any) {
    try {
      // Validate ID
      if (!id) {
        return { error: "Product ID is required", statusCode: 400 };
      }

      // Validate price if provided
      if (productData.price !== undefined && productData.price <= 0) {
        return {
          error: "Product price must be greater than 0",
          statusCode: 400,
        };
      }

      const product = await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return { error: "Product not found", statusCode: 404 };
      }

      return { data: product, statusCode: 200 };
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

  public static async deleteProduct(id: string) {
    try {
      // Validate ID
      if (!id) {
        return { error: "Product ID is required", statusCode: 400 };
      }

      const product = await Product.findByIdAndDelete(id);

      if (!product) {
        return { error: "Product not found", statusCode: 404 };
      }

      return {
        data: { message: "Product deleted successfully" },
        statusCode: 200,
      };
    } catch (error: any) {
      return { error: error.message, statusCode: 500 };
    }
  }
}
