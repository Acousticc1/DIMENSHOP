/**
 * Product domain entity
 */

export type ProductStatus = 'draft' | 'processing' | 'active' | 'archived';

export interface Product {
  readonly id: string;
  readonly sellerId: string;
  readonly categoryId: string | null;
  readonly title: string;
  readonly description: string;
  readonly price: number;
  readonly compareAtPrice: number | null;
  readonly stockQuantity: number;
  readonly status: ProductStatus;
  readonly modelUrl: string | null;
  readonly has3dModel: boolean;
  readonly metadata: Record<string, unknown> | null;
  readonly images: ProductImage[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface ProductImage {
  readonly id: string;
  readonly productId: string;
  readonly imageUrl: string;
  readonly sortOrder: number;
  readonly isPrimary: boolean;
}
