/**
 * Product repository interface
 */

import { Product, ProductStatus } from '../entities/Product';

export interface ProductFilters {
  categoryId?: string;
  status?: ProductStatus;
  sellerId?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  has3dModel?: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface IProductRepository {
  getById(id: string): Promise<Product | null>;
  getAll(filters: ProductFilters, page?: number, pageSize?: number): Promise<PaginatedResult<Product>>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  getByCategory(categoryId: string, page?: number): Promise<PaginatedResult<Product>>;
  search(query: string, page?: number): Promise<PaginatedResult<Product>>;
  getSellerProducts(sellerId: string, page?: number): Promise<PaginatedResult<Product>>;
}
