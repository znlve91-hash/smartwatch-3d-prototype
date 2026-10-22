/**
 * Formatting Utilities
 * Smart Watch & Band Interactive 3D Showcase & E-Commerce Prototype
 */

/**
 * Formats a numeric amount into standard US Dollar format ($X.XX).
 * @param {number|null|undefined} amount
 * @returns {string} e.g. "$99.00"
 */
export function formatUSD(amount) {
  const numeric = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numeric);
}

/**
 * Formats a numeric amount into Vietnamese Dong format (X.XXX.XXX ₫).
 * @param {number|null|undefined} amount
 * @returns {string} e.g. "2.500.000 ₫"
 */
export function formatVND(amount) {
  const numeric = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(numeric);
}

/**
 * Universal currency formatter supporting USD, VND, and other ISO currency codes.
 * @param {number|null|undefined} amount
 * @param {'USD'|'VND'|string} [currency='USD']
 * @param {string} [locale]
 * @returns {string}
 */
export function formatCurrency(amount, currency = 'USD', locale) {
  const targetCurrency = currency.toUpperCase();
  const targetLocale = locale || (targetCurrency === 'VND' ? 'vi-VN' : 'en-US');
  const numeric = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0;

  return new Intl.NumberFormat(targetLocale, {
    style: 'currency',
    currency: targetCurrency,
  }).format(numeric);
}

/**
 * Formats a number with thousand separators.
 * @param {number|null|undefined} number
 * @param {Intl.NumberFormatOptions} [options]
 * @returns {string} e.g. "1,234,567"
 */
export function formatNumber(number, options = {}) {
  const numeric = typeof number === 'number' && !Number.isNaN(number) ? number : 0;
  return new Intl.NumberFormat('en-US', options).format(numeric);
}

/**
 * Formats a ratio (0 - 1) or percentage into a percentage string.
 * @param {number} value (e.g. 0.742 or 74.2)
 * @param {number} [decimals=0]
 * @param {boolean} [isRatio=true] whether input is 0..1 ratio
 * @returns {string} e.g. "74%" or "74.2%"
 */
export function formatPercentage(value, decimals = 0, isRatio = true) {
  if (typeof value !== 'number' || Number.isNaN(value)) return '0%';
  const pct = isRatio && value <= 1 ? value * 100 : value;
  return `${pct.toFixed(decimals)}%`;
}

/**
 * Formats seconds into mm:ss format.
 * @param {number} seconds
 * @returns {string} e.g. "3:30"
 */
export function formatDuration(seconds) {
  if (typeof seconds !== 'number' || Number.isNaN(seconds) || seconds < 0) return '0:00';
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remainingSeconds = total % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

/**
 * Formats a Date object or ISO string into a human-readable date.
 * @param {Date|string|number|null|undefined} date
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */
export function formatDate(date, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!date) return '';
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  return new Intl.DateTimeFormat('en-US', options).format(parsed);
}

/**
 * Formats a Date into standard time (HH:MM or hh:mm a).
 * @param {Date|string|number} date
 * @param {boolean} [use24Hour=false]
 * @returns {string}
 */
export function formatTime(date, use24Hour = false) {
  if (!date) return '';
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';

  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: !use24Hour,
  }).format(parsed);
}
