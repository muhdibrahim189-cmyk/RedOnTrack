/**
 * Date utility functions
 * Pure functions for date operations
 */

export const formatDateRange = (start: Date, end: Date): string => {
  const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}, ${end.getFullYear()}`;
};

export const calculateWeekDateRange = (weekOffset: number): { start: Date; end: Date } => {
  const now = new Date();
  const end = new Date(now);
  end.setDate(now.getDate() - now.getDay() - weekOffset * 7 + 7);
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  return { start, end };
};

export const formatTime = (date: Date): string => {
  return date.toLocaleTimeString();
};

export const getCurrentDate = (): Date => {
  return new Date();
};
