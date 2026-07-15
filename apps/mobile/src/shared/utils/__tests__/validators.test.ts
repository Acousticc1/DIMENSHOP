import { signInSchema, signUpSchema } from '../validators';

describe('Authentication Form Validation Schemas', () => {
  describe('signInSchema', () => {
    it('should validate correct credentials', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: 'securepassword',
      });
      expect(result.success).toBe(true);
    });

    it('should reject invalid email format', () => {
      const result = signInSchema.safeParse({
        email: 'invalid-email',
        password: 'securepassword',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Please enter a valid email address');
      }
    });

    it('should reject passwords shorter than 6 characters', () => {
      const result = signInSchema.safeParse({
        email: 'test@example.com',
        password: '123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.errors[0].message).toBe('Password must be at least 6 characters');
      }
    });
  });

  describe('signUpSchema', () => {
    it('should validate correct registration payloads', () => {
      const result = signUpSchema.safeParse({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'strongpassword123',
        role: 'seller',
      });
      expect(result.success).toBe(true);
    });

    it('should reject unsupported role parameters', () => {
      const result = signUpSchema.safeParse({
        fullName: 'Jane Doe',
        email: 'jane@example.com',
        password: 'strongpassword123',
        role: 'unsupported-role',
      });
      expect(result.success).toBe(false);
    });
  });
});
