// import { ObjectId } from "mongodb";

import { ObjectId } from "mongodb";

export interface CreateProduct {
  seller: string;
  stock?: number;
  location?: string;
  condition?: string;
  name: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: Array<File>;
  tags?: string;
  isService?: boolean;
  addressWallet?: string;
}

export interface Product {
  _id: string | ObjectId;
  seller: string;
  name: string;
  addressWallet: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images: Array<string>;
  mainImage: string;
  stock: number;
  location?: string;
  condition?: string;
  tags?: string;
  isService?: boolean;
  isFeatured?: boolean;
  isOffer?: boolean;
  offerPercentage?: number;
  reviews?: string[];
  rating: number;
  subcategory?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem {
  _id: string;
  seller: string;
  name: string;
  price: number;
  mainImage: string;
  quantity: number;
  addressWallet: string;
  currency: string;
  isOffer?: boolean;
  offerPercentage?: number;
}

export interface Reviews {
  _id: string;
  text: string;
  rating: number;
}
