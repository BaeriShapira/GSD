// packages/server/middleware/adminMiddleware.js

/**
 * Admin Authorization Middleware
 * Only allows access to user with ID 1
 */
export const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
    }

    // Check if user ID is 1 (admin user)
    if (req.user.id !== 1) {
        return res.status(403).json({ error: "Admin access required" });
    }

    next();
};
