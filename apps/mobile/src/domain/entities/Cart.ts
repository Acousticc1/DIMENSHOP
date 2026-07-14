/**
 * Cart domain entity
 */

export interface CartItem {
  readonly id: string;
  readonly userId: string;
  readonly productId: string;
  readonly quantity: number;
  readonly createdAt: Date;
}

export interface CartItemWithProduct extends CartItem {
  readonly product: {
    readonly title: string;
    readonly price: number;
    readonly imageUrl: string | null;
    readonly stockQuantity: number;
  };
}
