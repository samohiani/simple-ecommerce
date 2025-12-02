import { Document } from "mongoose";
import { IProduct } from "./IProduct";
import { IUser } from "./IUser";

export interface IOrder extends Document {
  user: IUser["_id"];
  products: Array<{
    product: IProduct["_id"];
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}
