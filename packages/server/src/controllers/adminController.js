// packages/server/src/controllers/adminController.js
import { prisma } from "../config/prisma.js";
import { sendBroadcastEmail } from "../services/emailService.js";

/**
 * Get user statistics
 */
export const getUserStats = async (req, res) => {
    try {
        const totalUsers = await prisma.user.count();
        const activeUsers = await prisma.user.count({
            where: {
                lastLoginAt: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
                },
            },
        });
        const newUsers = await prisma.user.count({
            where: {
                createdAt: {
                    gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
                },
            },
        });

        const totalTasks = await prisma.task.count();
        const completedTasks = await prisma.task.count({
            where: { status: "COMPLETED" },
        });

        res.json({
            users: {
                total: totalUsers,
                active: activeUsers,
                new: newUsers,
            },
            tasks: {
                total: totalTasks,
                completed: completedTasks,
            },
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ error: "Failed to fetch user statistics" });
    }
};

/**
 * Get all users list
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                lastLoginAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

/**
 * Send broadcast email to all users
 */
export const sendBroadcast = async (req, res) => {
    try {
        const { subject, htmlContent } = req.body;

        if (!subject || !htmlContent) {
            return res.status(400).json({ error: "Subject and content are required" });
        }

        // Get all users
        const users = await prisma.user.findMany({
            select: {
                email: true,
                name: true,
            },
        });

        if (users.length === 0) {
            return res.status(400).json({ error: "No users found" });
        }

        // Send broadcast email
        await sendBroadcastEmail(users, subject, htmlContent);

        res.json({
            success: true,
            message: `Broadcast email sent to ${users.length} users`,
            recipientCount: users.length,
        });
    } catch (error) {
        console.error("Error sending broadcast:", error);
        res.status(500).json({ error: "Failed to send broadcast email" });
    }
};

/**
 * Send test email to admin
 */
export const sendTestEmail = async (req, res) => {
    try {
        const { subject, htmlContent } = req.body;

        if (!subject || !htmlContent) {
            return res.status(400).json({ error: "Subject and content are required" });
        }

        // Send test email to the admin user (requester)
        const adminUser = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: {
                email: true,
                name: true,
            },
        });

        if (!adminUser) {
            return res.status(404).json({ error: "Admin user not found" });
        }

        await sendBroadcastEmail([adminUser], subject, htmlContent);

        res.json({
            success: true,
            message: `Test email sent to ${adminUser.email}`,
        });
    } catch (error) {
        console.error("Error sending test email:", error);
        res.status(500).json({ error: "Failed to send test email" });
    }
};
