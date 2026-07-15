import { supabase } from '../supabase/client';
import { IProductRepository, ProductFilters, PaginatedResult } from '../../domain/repositories/IProductRepository';
import { Product, ProductStatus } from '../../domain/entities/Product';
import { AppError } from '../../domain/errors/AppError';
import { logger } from '../../shared/utils/logger';

export class SupabaseProductRepository implements IProductRepository {
  private mapRow(row: any): Product {
    return {
      id: row.id,
      sellerId: row.seller_id,
      categoryId: row.category_id,
      title: row.title,
      description: row.description,
      price: Number(row.price),
      compareAtPrice: row.compare_at_price ? Number(row.compare_at_price) : null,
      stockQuantity: row.stock_quantity,
      status: row.status as ProductStatus,
      modelUrl: row.model_url,
      has3dModel: row.has_3d_model,
      metadata: row.metadata,
      images: (row.product_images || []).map((img: any) => ({
        id: img.id,
        productId: img.product_id,
        imageUrl: img.image_url,
        sortOrder: img.sort_order,
        isPrimary: img.is_primary,
      })),
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async getById(id: string): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*, product_images(*)')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') return null; // Not found
        throw error;
      }
      return this.mapRow(data);
    } catch (err) {
      logger.error('Failed to get product by id', err, { id });
      throw new AppError('UNKNOWN_ERROR', 'Failed to retrieve product details');
    }
  }

  async getAll(filters: ProductFilters, page = 1, pageSize = 10): Promise<PaginatedResult<Product>> {
    try {
      let query = supabase
        .from('products')
        .select('*, product_images(*)', { count: 'exact' });

      // Apply Filters
      if (filters.categoryId) {
        query = query.eq('category_id', filters.categoryId);
      }
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.sellerId) {
        query = query.eq('seller_id', filters.sellerId);
      }
      if (filters.has3dModel !== undefined) {
        query = query.eq('has_3d_model', filters.has3dModel);
      }
      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice);
      }

      // Pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      const items = (data || []).map(row => this.mapRow(row));
      const totalCount = count || 0;

      return {
        data: items,
        count: totalCount,
        page,
        pageSize,
        hasMore: from + items.length < totalCount,
      };
    } catch (err) {
      logger.error('Failed to query products catalog', err);
      throw new AppError('UNKNOWN_ERROR', 'Failed to query products catalog');
    }
  }

  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'images'>): Promise<Product> {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert({
          seller_id: product.sellerId,
          category_id: product.categoryId,
          title: product.title,
          description: product.description,
          price: product.price,
          compare_at_price: product.compareAtPrice,
          stock_quantity: product.stockQuantity,
          status: product.status,
          model_url: product.modelUrl,
          has_3d_model: product.has3dModel,
          metadata: product.metadata,
        })
        .select('*, product_images(*)')
        .single();

      if (error) throw error;
      return this.mapRow(data);
    } catch (err) {
      logger.error('Failed to create product', err);
      throw new AppError('UNKNOWN_ERROR', 'Failed to create product listing');
    }
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    try {
      const payload: any = {};
      if (data.title !== undefined) payload.title = data.title;
      if (data.description !== undefined) payload.description = data.description;
      if (data.price !== undefined) payload.price = data.price;
      if (data.compareAtPrice !== undefined) payload.compare_at_price = data.compareAtPrice;
      if (data.stockQuantity !== undefined) payload.stock_quantity = data.stockQuantity;
      if (data.status !== undefined) payload.status = data.status;
      if (data.modelUrl !== undefined) payload.model_url = data.modelUrl;
      if (data.has3dModel !== undefined) payload.has_3d_model = data.has3dModel;
      if (data.metadata !== undefined) payload.metadata = data.metadata;

      const { data: updatedData, error } = await supabase
        .from('products')
        .update(payload)
        .eq('id', id)
        .select('*, product_images(*)')
        .single();

      if (error) throw error;
      return this.mapRow(updatedData);
    } catch (err) {
      logger.error('Failed to update product', err, { id });
      throw new AppError('UNKNOWN_ERROR', 'Failed to update product details');
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      logger.error('Failed to delete product', err, { id });
      throw new AppError('UNKNOWN_ERROR', 'Failed to delete product listing');
    }
  }

  async getByCategory(categoryId: string, page = 1): Promise<PaginatedResult<Product>> {
    return this.getAll({ categoryId, status: 'active' }, page);
  }

  async search(query: string, page = 1): Promise<PaginatedResult<Product>> {
    return this.getAll({ search: query, status: 'active' }, page);
  }

  async getSellerProducts(sellerId: string, page = 1): Promise<PaginatedResult<Product>> {
    return this.getAll({ sellerId }, page);
  }
}
