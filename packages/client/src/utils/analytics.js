import ReactGA from "react-ga4";

let isInitialized = false;

/**
 * Initialize Google Analytics
 * @param {string} measurementId - Your GA4 Measurement ID (G-XXXXXXXXXX)
 */
export const initGA = (measurementId) => {
    if (!measurementId) {
        console.warn("Google Analytics Measurement ID is not provided");
        return;
    }

    if (isInitialized) {
        console.warn("Google Analytics is already initialized");
        return;
    }

    try {
        ReactGA.initialize(measurementId, {
            gtagOptions: {
                send_page_view: false, // We'll send page views manually
            },
        });
        isInitialized = true;
        console.log("✅ Google Analytics initialized successfully");
    } catch (error) {
        console.error("❌ Failed to initialize Google Analytics:", error);
    }
};

/**
 * Track a page view
 * @param {string} path - The page path
 * @param {string} title - The page title
 */
export const trackPageView = (path, title) => {
    if (!isInitialized) return;

    try {
        ReactGA.send({
            hitType: "pageview",
            page: path,
            title: title,
        });
    } catch (error) {
        console.error("Failed to track page view:", error);
    }
};

/**
 * Track a custom event
 * @param {string} category - Event category
 * @param {string} action - Event action
 * @param {string} label - Event label (optional)
 * @param {number} value - Event value (optional)
 */
export const trackEvent = (category, action, label, value) => {
    if (!isInitialized) return;

    try {
        ReactGA.event({
            category,
            action,
            label,
            value,
        });
    } catch (error) {
        console.error("Failed to track event:", error);
    }
};

/**
 * Track user properties
 * @param {object} properties - User properties
 */
export const setUserProperties = (properties) => {
    if (!isInitialized) return;

    try {
        ReactGA.set(properties);
    } catch (error) {
        console.error("Failed to set user properties:", error);
    }
};
