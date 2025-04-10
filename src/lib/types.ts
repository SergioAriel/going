export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sellerId?: string;
}

export interface Seller {
  id: string;
  name: string;
  wallet: string;
}
