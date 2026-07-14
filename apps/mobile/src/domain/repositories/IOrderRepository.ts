/**
 * Order repository interface
 */

import { Order } from '../entities/Order';
import { PaginatedResult } from './IProductRepository';

export interface CreateOrderParams {
  addressId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface IOrderRepository {
  getById(id: string): Promise<Order | null>;
  getBuyerOrders(buyerId: string, page?: number): Promise<PaginatedResult<Order>>;
  getSellerOrders(sellerId: string, page?: number): Promise<PaginatedResult<Order>>;
  create(params: CreateOrderParams): Promise<Order>;
  updateStatus(id: string, status: Order['status']): Promise<Order>;
}
