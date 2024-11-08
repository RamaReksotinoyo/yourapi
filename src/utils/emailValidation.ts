import * as validator from 'validator';
import * as dns from 'dns';
import { promisify } from 'util';

// Promisify dns.resolveMx for easier async/await usage
const lookupMX = promisify(dns.resolveMx);

export async function validateMail(email: string): Promise<string | null> {
  // Validate email format
  if (!validator.isEmail(email)) {
    return 'Invalid email';
  }

  // Extract domain from email
  const domain = email.split('@')[1];

  try {
    // Perform MX record lookup
    const mxRecords = await lookupMX(domain);
    if (mxRecords.length === 0) {
      return 'Domain email not found';
    }
  } catch (error) {
    return 'Domain email not found';
  }

  return null;
}