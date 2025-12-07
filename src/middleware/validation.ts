import { Request, Response, NextFunction } from 'express';

interface ValidationError {
  field: string;
  message: string;
}

interface RegistrationData {
  fullName?: string;
  dateOfBirth?: string;
  email?: string;
  password?: string;
  role?: string;
}


interface LoginData {
  email?: string;
  password?: string;
}

export class Validator {
  private errors: ValidationError[] = [];

  private reset() {
    this.errors = [];
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  static hasNoLeadingSpaces(value: string): boolean {
    return value.trim() === value;
  }

  static isNonNegativeNumber(value: number): boolean {
    return Number.isFinite(value) && value >= 0;
  }

  static isInteger(value: number): boolean {
    return Number.isInteger(value);
  }

  validateRegistration(data: RegistrationData): ValidationError[] {
    this.reset();

    const { fullName, dateOfBirth, email, password, role } = data;

    if (!fullName?.trim()) {
      this.errors.push({ field: 'fullName', message: 'Full name is required' });
    } else if (!Validator.hasNoLeadingSpaces(fullName)) {
      this.errors.push({ field: 'fullName', message: 'Full name cannot start with spaces' });
    }

    if (!dateOfBirth) {
      this.errors.push({ field: 'dateOfBirth', message: 'Date of birth is required' });
    } else {
      const date = new Date(dateOfBirth);
      if (isNaN(date.getTime())) {
        this.errors.push({ field: 'dateOfBirth', message: 'Invalid date format' });
      } else if (date > new Date()) {
        this.errors.push({ field: 'dateOfBirth', message: 'Date of birth cannot be in the future' });
      }
    }

    if (!email?.trim()) {
      this.errors.push({ field: 'email', message: 'Email is required' });
    } else if (!Validator.isValidEmail(email)) {
      this.errors.push({ field: 'email', message: 'Invalid email format' });
    } else if (!Validator.hasNoLeadingSpaces(email)) {
      this.errors.push({ field: 'email', message: 'Email cannot start with spaces' });  
    }

    if (!password) {
      this.errors.push({ field: 'password', message: 'Password is required' });
    } else if (!Validator.isValidPassword(password)) {
      this.errors.push({ field: 'password', message: 'Password must be at least 6 characters long' }); 
    }else if (!Validator.hasNoLeadingSpaces(password)) {
      this.errors.push({ field: 'password', message: 'Password cannot start with spaces' });  
    }

    if (role && !['admin', 'user'].includes(role)) {
      this.errors.push({ field: 'role', message: 'Role must be either "admin" or "user"' });
    }

    return this.errors;
  }

  validateLogin(data: LoginData): ValidationError[] {
    this.reset();

    const { email, password } = data;

    if (!email?.trim()) {
      this.errors.push({ field: 'email', message: 'Email is required' });
    } else if (!Validator.isValidEmail(email)) {
      this.errors.push({ field: 'email', message: 'Invalid email format' });
    }

    if (!password) {
      this.errors.push({ field: 'password', message: 'Password is required' });
    }

    return this.errors;
  }

  validateUserId(id: string | number): ValidationError[] {
    this.reset();

    const numId = typeof id === 'string' ? parseInt(id, 10) : id;

    if (!id && id !== 0) {
      this.errors.push({ field: 'id', message: 'User ID is required' });
    } else if (isNaN(numId)) {
      this.errors.push({ field: 'id', message: 'User ID must be a number' });
    } else if (!Validator.isNonNegativeNumber(numId)) {
      this.errors.push({ field: 'id', message: 'User ID must be a non-negative number' });
    } else if (!Validator.isInteger(numId)) {
      this.errors.push({ field: 'id', message: 'User ID must be an integer' });
    }

    return this.errors;
  }

  validateSearchQuery(query: string): ValidationError[] {
    this.reset();

    if (!query?.trim()) {
      this.errors.push({ field: 'query', message: 'Search query is required' });
    } else if (!Validator.hasNoLeadingSpaces(query)) {
      this.errors.push({ field: 'query', message: 'Search query cannot start with spaces' });
    }

    return this.errors;
  }
}

export const validateRegistration = (req: Request, res: Response, next: NextFunction) => {
  const validator = new Validator();
  const errors = validator.validateRegistration(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const validator = new Validator();
  const errors = validator.validateLogin(req.body);

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

export const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const validator = new Validator();
  const errors = validator.validateUserId(req.params.id);

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};

export const validateSearchQuery = (req: Request, res: Response, next: NextFunction) => {
  const validator = new Validator();
  const errors = validator.validateSearchQuery(req.query.q as string);

  if (errors.length > 0) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors
    });
  }

  next();
};