/**
 * Date utility functions for consistent date/time handling
 */

/**
 * Convert date and optional time to ISO string with proper UTC handling
 *
 * When time is provided, it's treated as local time and converted to UTC.
 * When no time is provided, this ensures the date is stored as UTC midnight (00:00:00.000Z)
 * instead of being interpreted in local timezone, which can cause incorrect times like 02:00.
 *
 * @param {string} dateString - Date in YYYY-MM-DD format (from date input)
 * @param {string|null} timeString - Optional time in HH:MM format (from time input, local time)
 * @returns {string|null} ISO 8601 string in UTC or null if no date provided
 *
 * @example
 * // If user is in GMT+2 timezone:
 * convertToISOString("2025-11-27", "14:30") // "2025-11-27T12:30:00.000Z" (14:30 local = 12:30 UTC)
 * convertToISOString("2025-11-27", null)    // "2025-11-27T00:00:00.000Z"
 * convertToISOString("2025-11-27", "")      // "2025-11-27T00:00:00.000Z"
 */
export function convertToISOString(dateString, timeString = null) {
    if (!dateString) return null;

    // If time is provided, combine date and time
    // Don't add 'Z' suffix - let JavaScript treat input as local time and convert to UTC
    if (timeString && timeString.trim() !== "") {
        return new Date(dateString + `T${timeString}:00`).toISOString();
    }

    // No time: explicitly use UTC midnight to avoid timezone issues
    return new Date(dateString + 'T00:00:00.000Z').toISOString();
}

/**
 * Extract date from ISO string in YYYY-MM-DD format
 *
 * @param {string} isoString - ISO 8601 date string
 * @returns {string|null} Date in YYYY-MM-DD format or null
 *
 * @example
 * extractDate("2025-11-27T14:30:00.000Z") // "2025-11-27"
 */
export function extractDate(isoString) {
    if (!isoString) return null;
    return isoString.split('T')[0];
}

/**
 * Extract time from ISO string in HH:MM format
 *
 * @param {string} isoString - ISO 8601 date string
 * @returns {string|null} Time in HH:MM format or null if midnight (00:00)
 *
 * @example
 * extractTime("2025-11-27T14:30:00.000Z") // "14:30"
 * extractTime("2025-11-27T00:00:00.000Z") // null (no time set)
 */
export function extractTime(isoString) {
    if (!isoString) return null;

    const time = isoString.split('T')[1]?.substring(0, 5); // Get HH:MM

    // If time is midnight (00:00), treat as "no time set"
    if (time === "00:00") return null;

    return time;
}

/**
 * Check if a date has a specific time set (not midnight)
 *
 * @param {string} isoString - ISO 8601 date string
 * @returns {boolean} True if time is not 00:00
 *
 * @example
 * hasTime("2025-11-27T14:30:00.000Z") // true
 * hasTime("2025-11-27T00:00:00.000Z") // false
 */
export function hasTime(isoString) {
    return extractTime(isoString) !== null;
}

/**
 * Get today's date normalized to UTC midnight
 * This ensures consistent "today" across all timezones
 *
 * @returns {Date} Today's date at UTC midnight (00:00:00.000Z)
 *
 * @example
 * // User in UTC+10 at 01:00 AM local time
 * getTodayUTC() // Returns 2025-12-29T00:00:00.000Z (not 2025-12-28)
 */
export function getTodayUTC() {
    const now = new Date();
    // Create a new date at UTC midnight for today
    return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}
