import { create } from 'zustand';
import { WishlistItemWithProduct } from '../../domain/entities/Wishlist';
import { logger } from '../../shared/utils/logger';

interface WishlistState {
  items: WishlistItemWithProduct[];
  isLoading: boolean;
  error: string | null;
  
  fetchItems: () => Promise<void>;
  toggleWishlist: (productId: string, product: { title: string; price: number; imageUrl: string | null; has3dModel: boolean }) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Fetching wishlist items');
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch wishlist', isLoading: false });
    }
  },

  toggleWishlist: async (productId, product) => {
    const currentItems = get().items;
    const existingIndex = currentItems.findIndex(item => item.productId === productId);

    if (existingIndex > -1) {
      // Remove
      set({ items: currentItems.filter(item => item.productId !== productId) });
      logger.info('Removed from wishlist', { productId });
    } else {
      // Add
      const newItem: WishlistItemWithProduct = {
        id: Math.random().toString(),
        userId: 'current-user-id',
        productId,
        createdAt: new Date(),
        product,
      };
      set({ items: [...currentItems, newItem] });
      logger.info('Added to wishlist', { productId });
    }
  },

  isInWishlist: (productId) => {
    return get().items.some(item => item.productId === productId);
  },
}));
