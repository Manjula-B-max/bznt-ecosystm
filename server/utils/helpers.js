/**
 * server/utils/helpers.js
 * Shared utility functions used across the backend.
 */

/** Generate a unique random ID (used as primary key for new records). */
export const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);

/** Parse a currency string like "₹1,23,456.78" → 123456.78 */
export const parseCurrency = (v) => {
    if (typeof v === 'number') return v;
    return parseFloat(String(v || '0').replace(/[^0-9.]/g, '')) || 0;
};
