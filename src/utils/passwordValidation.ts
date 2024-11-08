export function validatePassword(password: string): Error | null {
    const isMoreThan8 = password.length > 8;
    let isLower = false;
    let isUpper = false;
    let isSymbol = false;
  
    for (const char of password) {
      if (!isLower && /[a-z]/.test(char)) isLower = true;
      if (!isUpper && /[A-Z]/.test(char)) isUpper = true;
      if (!isSymbol && /[^\w\s]/.test(char)) isSymbol = true;
    }
  
    const isValid = isLower && isUpper && isSymbol && isMoreThan8;
    if (!isValid) {
      return new Error('Invalid password');
    }
  
    return null;
  }
  