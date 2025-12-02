import { useState, useEffect } from "react";

/**
 * Custom hook to detect mobile screen size
 * Uses media query matching Tailwind's lg breakpoint (1024px)
 * @returns {boolean} isMobile - true if screen width < 1024px
 */
export function useMobileDetection() {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.matchMedia("(max-width: 425px)").matches;
    });

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 425px)");

        const handleChange = (e) => {
            setIsMobile(e.matches);
        };

        // Add listener for changes
        mediaQuery.addEventListener("change", handleChange);

        // Cleanup
        return () => {
            mediaQuery.removeEventListener("change", handleChange);
        };
    }, []);

    return isMobile;
}
