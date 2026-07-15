import { create } from 'zustand';
import { CartItemWithProduct } from '../../domain/entities/Cart';
import { logger } from '../../shared/utils/logger';

interface CartState {
  items: CartItemWithProduct[];
  isLoading: boolean;
  error: string | null;
  
  fetchItems: () => Promise<void>;
  addItem: (productId: string, product: { title: string; price: number; imageUrl: string | null; stockQuantity: number }) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      // Local caching / stub database mock for UI prototyping
      logger.info('Fetching cart items');
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch cart', isLoading: false });
    }
  },

  addItem: async (productId, product) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Adding item to cart', { productId });
      const currentItems = get().items;
      const existingItem = currentItems.find(item => item.productId === productId);

      if (existingItem) {
        // Increment quantity
        const updated = currentItems.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        set({ items: updated, isLoading: false });
      } else {
        // Create new item
        const newItem: CartItemWithProduct = {
          id: Math.random().toString(),
          userId: 'current-user-id',
          productId,
          quantity: 1,
          createdAt: new Date(),
          product,
        };
        set({ items: [...currentItems, newItem], isLoading: false });
      }
    } catch (err: any) {
      set({ error: err.message || 'Failed to add item', isLoading: false });
    }
  },

  updateQuantity: async (id, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(id);
      return;
    }
    set({ items: get().items.map(item => item.id === id ? { ...item, quantity } : item) });
  },

  removeItem: async (id) => {
    set({ items: get().items.filter(item => item.id !== id) });
  },

  clearCart: async () => {
    set({ items: [] });
  },

  getCartTotal: () => {
    return get().items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  getItemCount: () => {
    return get().items.reduce((count, item) => count + item.quantity, 0);
  },
}));
