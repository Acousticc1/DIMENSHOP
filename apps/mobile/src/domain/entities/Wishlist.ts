/**
 * Wishlist domain entity
 */

export interface WishlistItem {
  readonly id: string;
  readonly userId: string;
  readonly productId: string;
  readonly createdAt: Date;
}

export interface WishlistItemWithProduct extends WishlistItem {
  readonly product: {
    readonly title: string;
    readonly price: number;
    readonly imageUrl: string | null;
    readonly has3dModel: boolean;
  };
}
