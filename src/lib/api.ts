/**
 * API functions for fetching data
 */

// Type definitions for our data
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  slug: string;
  stock: number;
  sellerId: number;
}

export interface Seller {
  id: number;
  name: string;
  wallet: string;
}

interface DbData {
  products: Product[];
  sellers: Seller[];
}

/**
 * Fetches all products from the database
 * @returns Promise containing an array of products
 */

const API_URL_PRODUCTS = process.env.NEXT_PUBLIC_API_URL || '/api/db';

export async function getProducts(): Promise<[]> {
  try {
    const response = await fetch(API_URL_PRODUCTS);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

/**
 * Fetches a single product by its slug
 * @param slug The product slug to fetch
 * @returns Promise containing the product or null if not found
 */
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const products = await getProducts();
    return products.find(product => product?.slug === slug) || null;
  } catch (error) {
    console.error('Error fetching product by slug:', error);
    return null;
  }
}

/**
 * Fetches a seller by ID
 * @param id The seller ID to fetch
 * @returns Promise containing the seller or null if not found
 */
export async function getSellerById(id: number): Promise<Seller | null> {
  try {
    const response = await fetch(API_URL_PRODUCTS);
    if (!response.ok) {
      throw new Error('Failed to fetch sellers');
    }
    const data: DbData = await response.json();
    return data.sellers.find(seller => seller.id === id) || null;
  } catch (error) {
    console.error('Error fetching seller:', error);
    return null;
  }
}
