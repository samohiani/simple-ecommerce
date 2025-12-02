import { IProduct } from "./IProduct";
import { IUser } from "./IUser";

export interface ICart {
  user: IUser["_id"];
  products: Array<{
    product: IProduct["_id"];
    quantity: number;
  }>;
  totalAmount: number;
}
