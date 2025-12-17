import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { trackPageView } from "../utils/analytics";

/**
 * Hook to track page views automatically with Google Analytics
 * Use this at the root level of your app
 */
export const usePageTracking = () => {
    const location = useLocation();

    useEffect(() => {
        // Track page view on route change
        const path = location.pathname + location.search;
        const title = document.title;

        trackPageView(path, title);
    }, [location]);
};
