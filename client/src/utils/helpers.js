/**
 * client/src/utils/helpers.js
 * Shared frontend utility functions.
 */

/** Format a number as currency (e.g. 12345.6 → "₹12,345.60") */
export const formatCurrency = (amount, symbol = '₹') =>
    `${symbol}${Number(amount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

/** Capitalise first letter of each word */
export const titleCase = (str) =>
    String(str || '').replace(/\b\w/g, c => c.toUpperCase());

/** Safely parse JSON without throwing */
export const safeJson = (str, fallback = null) => {
    try { return JSON.parse(str); } catch { return fallback; }
};

/** Truncate a string to maxLen characters */
export const truncate = (str, maxLen = 80) =>
    str && str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
