/**
 * Validation utility functions
 * Pure functions for data validation
 */

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidEmployeeId = (id: string): boolean => {
  return /^\d{8}$/.test(id);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

export const isNotEmpty = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};
