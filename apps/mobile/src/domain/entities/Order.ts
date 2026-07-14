/**
 * Order domain entity
 */

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export interface Order {
  readonly id: string;
  readonly buyerId: string;
  readonly addressId: string;
  readonly orderNumber: string;
  readonly subtotal: number;
  readonly tax: number;
  readonly shippingCost: number;
  readonly total: number;
  readonly status: OrderStatus;
  readonly paymentStatus: PaymentStatus;
  readonly paymentIntentId: string | null;
  readonly items: OrderItem[];
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface OrderItem {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly sellerId: string;
  readonly quantity: number;
  readonly unitPrice: number;
  readonly totalPrice: number;
}
