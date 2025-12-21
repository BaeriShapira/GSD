// packages/server/src/routes/adminRoutes.js
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../../middleware/adminMiddleware.js";
import {
    getUserStats,
    getAllUsers,
    sendBroadcast,
    sendTestEmail,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require authentication first, then admin check
router.use(authMiddleware);
router.use(requireAdmin);

// Get user statistics
router.get("/stats", getUserStats);

// Get all users
router.get("/users", getAllUsers);

// Send broadcast email to all users
router.post("/broadcast", sendBroadcast);

// Send test email to admin
router.post("/test-email", sendTestEmail);

export default router;
