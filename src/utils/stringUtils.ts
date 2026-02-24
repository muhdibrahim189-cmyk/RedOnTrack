/**
 * String utility functions
 * Pure functions for string operations
 */

export const truncateString = (str: string, maxLength: number): string => {
  return str.length > maxLength ? `${str.substring(0, maxLength)}...` : str;
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const generateSystemFilename = (
  date: string,
  day: string,
  time: string,
  platform: string
): string => {
  return `${date}_${day.substring(0, 3)}_${time.replace(':', '')}_${platform.replace(' ', '')}`;
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
};
