/**
 * Base application error class
 * All domain-specific errors extend this
 */

export type ErrorCode =
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_IN_USE'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_UNAUTHORIZED'
  | 'PRODUCT_NOT_FOUND'
  | 'PRODUCT_OUT_OF_STOCK'
  | 'ORDER_NOT_FOUND'
  | 'ORDER_INVALID_STATUS'
  | 'CART_EMPTY'
  | 'PROCESSING_JOB_FAILED'
  | 'UPLOAD_FAILED'
  | 'NETWORK_ERROR'
  | 'VALIDATION_ERROR'
  | 'UNKNOWN_ERROR';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: Record<string, unknown>,
  ) {
    super(message);
    this.name = 'AppError';
  }

  static unauthorized(message = 'Unauthorized'): AppError {
    return new AppError('AUTH_UNAUTHORIZED', message, 401);
  }

  static notFound(resource: string): AppError {
    return new AppError('PRODUCT_NOT_FOUND', `${resource} not found`, 404);
  }

  static validation(message: string, details?: Record<string, unknown>): AppError {
    return new AppError('VALIDATION_ERROR', message, 400, details);
  }

  static network(message = 'Network error'): AppError {
    return new AppError('NETWORK_ERROR', message, 503);
  }
}
