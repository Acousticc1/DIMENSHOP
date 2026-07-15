import { create } from 'zustand';
import { Product } from '../../domain/entities/Product';
import { logger } from '../../shared/utils/logger';

interface SellerDashboardData {
  earnings: number;
  soldCount: number;
  activeJobsCount: number;
}

interface SellerState {
  products: Product[];
  earnings: number;
  soldCount: number;
  activeJobsCount: boolean; // loading or active jobs tracking
  isLoading: boolean;
  error: string | null;

  fetchDashboardData: () => Promise<SellerDashboardData>;
  fetchProducts: (sellerId: string) => Promise<void>;
  createProduct: (productData: {
    title: string;
    description: string;
    price: number;
    stockQuantity: number;
    categoryId: string;
  }) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useSellerStore = create<SellerState>((set, get) => ({
  products: [],
  earnings: 1250.00, // Initial seed stats
  soldCount: 8,
  activeJobsCount: false,
  isLoading: false,
  error: null,

  fetchDashboardData: async () => {
    logger.info('Fetching seller dashboard stats');
    return {
      earnings: get().earnings,
      soldCount: get().soldCount,
      activeJobsCount: 1, // 1 mock reconstruction job running
    };
  },

  fetchProducts: async (sellerId) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Fetching products for seller', { sellerId });
      // Initially, we fall back to a mock list generated from MOCK_PRODUCTS
      // When database CRUD is finished, this connects to Supabase repository
      set({ isLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Failed to fetch seller products', isLoading: false });
    }
  },

  createProduct: async (productData) => {
    set({ isLoading: true, error: null });
    try {
      logger.info('Creating product draft', productData);
      
      const newProduct: Product = {
        id: Math.random().toString(),
        sellerId: 'current-seller-id',
        categoryId: productData.categoryId,
        title: productData.title,
        description: productData.description,
        price: productData.price,
        compareAtPrice: null,
        stockQuantity: productData.stockQuantity,
        status: 'draft',
        modelUrl: null,
        has3dModel: false,
        metadata: {},
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      set({ 
        products: [newProduct, ...get().products],
        isLoading: false 
      });

      return newProduct;
    } catch (err: any) {
      set({ error: err.message || 'Failed to create product', isLoading: false });
      throw err;
    }
  },

  deleteProduct: async (id) => {
    set({ products: get().products.filter(p => p.id !== id) });
  },
}));
