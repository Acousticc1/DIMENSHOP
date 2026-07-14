/**
 * Category domain entity
 */

export interface Category {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly iconUrl: string | null;
  readonly parentId: string | null;
  readonly sortOrder: number;
}
