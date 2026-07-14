/**
 * Wishlist repository interface
 */

import { WishlistItem, WishlistItemWithProduct } from '../entities/Wishlist';
import { PaginatedResult } from './IProductRepository';

export interface IWishlistRepository {
  getItems(userId: string, page?: number): Promise<PaginatedResult<WishlistItemWithProduct>>;
  addItem(userId: string, productId: string): Promise<WishlistItem>;
  removeItem(id: string): Promise<void>;
  isInWishlist(userId: string, productId: string): Promise<boolean>;
}
