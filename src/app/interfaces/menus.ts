export interface Category {
  id: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: number;
  isVegetarian: boolean;
  rating: number;
}

export interface FilterParams {
  search: string;
  categoryId?: number;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  isVegetarian: boolean;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  isVegetarian: boolean;
  rating: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  message?: string;
}