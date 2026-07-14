/**
 * Cart repository interface
 */

import { CartItem, CartItemWithProduct } from '../entities/Cart';

export interface ICartRepository {
  getItems(userId: string): Promise<CartItemWithProduct[]>;
  addItem(userId: string, productId: string, quantity: number): Promise<CartItem>;
  updateQuantity(id: string, quantity: number): Promise<CartItem>;
  removeItem(id: string): Promise<void>;
  clearCart(userId: string): Promise<void>;
  getItemCount(userId: string): Promise<number>;
}
