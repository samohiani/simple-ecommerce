import mongoose, { Schema } from "mongoose";
import { IProduct } from "../interfaces/IProduct";
import { IUser } from "../interfaces/IUser";

export interface ICart extends mongoose.Document {
  user: IUser["_id"];
  products: Array<{
    product: IProduct["_id"];
    quantity: number;
  }>;
  totalAmount: number;
}

const cartSchema: Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate total amount before saving
cartSchema.pre<ICart>("save", async function (next) {
  if (!this.isModified("products")) {
    return next();
  }

  let total = 0;
  for (const item of this.products) {
    const product = await mongoose.model("Product").findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }
  this.totalAmount = total;
  next();
});

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
