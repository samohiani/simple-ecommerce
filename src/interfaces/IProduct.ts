import { Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
}

export interface IGetProductsFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sort?: string;
}
