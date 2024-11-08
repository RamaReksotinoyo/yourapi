// test/passwordValidation.spec.ts
import { validatePassword } from './passwordValidation';

describe('validatePassword', () => {

    it('should return an error for passwords less than 8', () => {
        const result = validatePassword('Pass12@');
        expect(result).toEqual(new Error('Invalid password'));
    });

    it('should return an error for passwords without uppercase', () => {
        const result = validatePassword('password123!');
        expect(result).toEqual(new Error('Invalid password'));
    });

    it('should return an error for passwords without lowercase', () => {
        const result = validatePassword('PASSWORD123!');
        expect(result).toEqual(new Error('Invalid password'));
    });

    it('should return an error for passwords without symbols', () => {
        const result = validatePassword('passworD123');
        expect(result).toEqual(new Error('Invalid password'));
      });

    it('should return an error for passwords without uppercase, lowercase, and symbols', () => {
        const result = validatePassword('password');
        expect(result).toEqual(new Error('Invalid password'));
    });

  it('should return null for valid passwords', () => {
    const result = validatePassword('Valid$Password1');
    expect(result).toBeNull();
  });
});
