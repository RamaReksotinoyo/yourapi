import * as dns from 'dns';
import { validateMail } from './emailValidation';

jest.mock('dns');

describe('validateMail', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear mocks before each test
  });

  it('should return null for a valid email with existing domain', async () => {
    const email = 'test@example.com';
    
    // Mocking the DNS resolution to return a valid MX record
    (dns.resolveMx as unknown as jest.Mock).mockImplementation((domain, callback) => {
      callback(null, [{ exchange: 'mx.example.com', priority: 10 }]);
    });

    const result = await validateMail(email);
    expect(result).toBeNull();
  });

  it('should return "Invalid email" for an invalid email format', async () => {
    const email = 'invalid-email';
    
    const result = await validateMail(email);
    expect(result).toBe('Invalid email');
  });

  it('should return "Domain email not found" for a non-existing domain', async () => {
    const email = 'test@nonexistentdomain.com';
    
    // Mocking the DNS resolution to simulate a non-existing domain
    (dns.resolveMx as unknown as jest.Mock).mockImplementation((domain, callback) => {
      callback(new Error('Domain not found'));
    });

    const result = await validateMail(email);
    expect(result).toBe('Domain email not found');
  });

  it('should return "Domain email not found" for an email with no MX records', async () => {
    const email = 'test@emptydomain.com';
    
    // Mocking the DNS resolution to return no MX records
    (dns.resolveMx as unknown as jest.Mock).mockImplementation((domain, callback) => {
      callback(null, []); // No MX records found
    });

    const result = await validateMail(email);
    expect(result).toBe('Domain email not found');
  });
});
