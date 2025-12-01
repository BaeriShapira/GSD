import { useMemo } from "react";

/**
 * Custom hook for searching/filtering tasks
 * @param {Array} items - Array of items to search through
 * @param {string} query - Search query string
 * @returns {Array} Filtered items matching the search query
 */
export function useSearch(items, query) {
    const filteredItems = useMemo(() => {
        if (!query || !query.trim()) {
            return items;
        }

        const lowerQuery = query.toLowerCase();

        return items.filter(item => {
            // Search in text
            if (item.text?.toLowerCase().includes(lowerQuery)) return true;

            // Search in labels
            if (item.labels?.toLowerCase().includes(lowerQuery)) return true;

            // Search in attachment names
            if (item.attachments?.some(att =>
                att.originalName?.toLowerCase().includes(lowerQuery)
            )) return true;

            return false;
        });
    }, [items, query]);

    return filteredItems;
}
