import { create } from 'zustand';
import { Product } from '../../domain/entities/Product';
import { ProductFilters } from '../../domain/repositories/IProductRepository';
import { SupabaseProductRepository } from '../../infrastructure/repositories/SupabaseProductRepository';
import { logger } from '../../shared/utils/logger';

const productRepository = new SupabaseProductRepository();

interface ProductState {
  products: Product[];
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  hasMore: boolean;
  
  fetchProducts: (filters: ProductFilters, page?: number, append?: boolean) => Promise<void>;
  fetchProductDetail: (id: string) => Promise<void>;
  clearSelectedProduct: () => void;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  hasMore: false,

  fetchProducts: async (filters, page = 1, append = false) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Querying products catalog from store', { filters, page });
      const result = await productRepository.getAll(filters, page, 10);
      
      set({
        products: append ? [...get().products, ...result.data] : result.data,
        currentPage: page,
        hasMore: result.hasMore,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch catalog', isLoading: false });
    }
  },

  fetchProductDetail: async (id) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Fetching product detail from store', { id });
      const product = await productRepository.getById(id);
      set({ selectedProduct: product, isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to retrieve product', isLoading: false });
    }
  },

  clearSelectedProduct: () => set({ selectedProduct: null }),
}));
