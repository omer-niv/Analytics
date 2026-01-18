import { format } from 'date-fns';

/**
 * Format numbers with abbreviations (K, M, B)
 */
export function formatNumber(value: number, decimals: number = 2): string {
  if (value === 0) return '0';

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e9) {
    return sign + (absValue / 1e9).toFixed(decimals) + 'B';
  }
  if (absValue >= 1e6) {
    return sign + (absValue / 1e6).toFixed(decimals) + 'M';
  }
  if (absValue >= 1e3) {
    return sign + (absValue / 1e3).toFixed(decimals) + 'K';
  }

  return sign + absValue.toFixed(decimals);
}

/**
 * Format currency values
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
}

/**
 * Format percentages
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return (value * 100).toFixed(decimals) + '%';
}

/**
 * Format dates
 */
export function formatDate(date: Date | string, formatStr: string = 'MMM dd, yyyy'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, formatStr);
}

/**
 * Format file sizes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
