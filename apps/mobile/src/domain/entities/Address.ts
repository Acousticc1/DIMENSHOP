/**
 * Address domain entity
 */

export interface Address {
  readonly id: string;
  readonly userId: string;
  readonly label: string;
  readonly line1: string;
  readonly line2: string | null;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: string;
  readonly isDefault: boolean;
}
