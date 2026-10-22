/**
 * Formatter utilities for currency, dates, numbers, and display labels.
 */

/**
 * Formats a numeric price into a USD currency string.
 * Example: 49 -> "$49", 299.99 -> "$299.99"
 */
export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions
): string {
  const hasDecimals = amount % 1 !== 0;
  const defaultOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  };

  return new Intl.NumberFormat('en-US', {
    ...defaultOptions,
    ...options,
  }).format(amount);
}

/**
 * Formats a number with standard thousands separators.
 * Example: 7420 -> "7,420"
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Converts a tier identifier (e.g., "pro_max", "standard") to a display string (e.g., "Pro Max", "Standard").
 */
export function formatTierName(tier: string): string {
  if (!tier) return '';
  return tier
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Converts a category identifier to a friendly display string.
 */
export function formatCategoryName(category: string): string {
  switch (category) {
    case 'band':
      return 'Fitness Band';
    case 'watch':
      return 'Smart Watch';
    case 'all':
      return 'All Devices';
    default:
      return category.charAt(0).toUpperCase() + category.slice(1);
  }
}

/**
 * Formats a date into a clean localized date string.
 * Example: "Oct 22, 2026"
 */
export function formatDate(
  date: string | Date | number,
  options?: Intl.DateTimeFormatOptions
): string {
  const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(dateObj);
}

/**
 * Formats a rating value to single-decimal format.
 * Example: 4.8 -> "4.8"
 */
export function formatRating(rating: number): string {
  return (Math.round(rating * 10) / 10).toFixed(1);
}

/**
 * Formats a percentage value.
 * Example: 88 -> "88%"
 */
export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}
