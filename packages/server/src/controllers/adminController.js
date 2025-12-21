// packages/server/src/controllers/adminController.js
import { prisma } from "../config/prisma.js";
import { sendBroadcastEmail } from "../services/emailService.js";

/**
 * Get user statistics
 */
export const getUserStats = async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

        // User statistics
        const totalUsers = await prisma.user.count();
        const usersToday = await prisma.user.count({
            where: { createdAt: { gte: todayStart } },
        });
        const usersThisWeek = await prisma.user.count({
            where: { createdAt: { gte: weekStart } },
        });
        const usersThisMonth = await prisma.user.count({
            where: { createdAt: { gte: monthStart } },
        });

        // Task statistics
        const totalTasks = await prisma.task.count();
        const tasksToday = await prisma.task.count({
            where: { createdAt: { gte: todayStart } },
        });
        const tasksThisWeek = await prisma.task.count({
            where: { createdAt: { gte: weekStart } },
        });
        const tasksThisMonth = await prisma.task.count({
            where: { createdAt: { gte: monthStart } },
        });

        // Project statistics
        const totalProjects = await prisma.project.count();
        const projectsToday = await prisma.project.count({
            where: { createdAt: { gte: todayStart } },
        });
        const projectsThisWeek = await prisma.project.count({
            where: { createdAt: { gte: weekStart } },
        });
        const projectsThisMonth = await prisma.project.count({
            where: { createdAt: { gte: monthStart } },
        });

        res.json({
            users: {
                total: totalUsers,
                today: usersToday,
                thisWeek: usersThisWeek,
                thisMonth: usersThisMonth,
            },
            tasks: {
                total: totalTasks,
                today: tasksToday,
                thisWeek: tasksThisWeek,
                thisMonth: tasksThisMonth,
            },
            projects: {
                total: totalProjects,
                today: projectsToday,
                thisWeek: projectsThisWeek,
                thisMonth: projectsThisMonth,
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
 * Get most active users (by task count)
 */
export const getMostActiveUsers = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;

        // Get all users with their task count
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                createdAt: true,
                _count: {
                    select: { tasks: true },
                },
            },
        });

        // Sort by task count and take top N
        const sortedUsers = users
            .map((user) => ({
                id: user.id,
                email: user.email,
                name: user.name,
                createdAt: user.createdAt,
                taskCount: user._count.tasks,
            }))
            .sort((a, b) => b.taskCount - a.taskCount)
            .slice(0, limit);

        res.json(sortedUsers);
    } catch (error) {
        console.error("Error fetching most active users:", error);
        res.status(500).json({ error: "Failed to fetch most active users" });
    }
};

/**
 * Send broadcast email to all users or selected users
 */
export const sendBroadcast = async (req, res) => {
    try {
        const { subject, htmlContent, recipientType, userIds, topActiveCount } = req.body;

        if (!subject || !htmlContent) {
            return res.status(400).json({ error: "Subject and content are required" });
        }

        let users;

        // Determine which users to send to based on recipientType
        if (recipientType === "all") {
            // Send to all users
            users = await prisma.user.findMany({
                select: {
                    email: true,
                    name: true,
                },
            });
        } else if (recipientType === "selected" && userIds && userIds.length > 0) {
            // Send to selected users
            users = await prisma.user.findMany({
                where: {
                    id: { in: userIds },
                },
                select: {
                    email: true,
                    name: true,
                },
            });
        } else if (recipientType === "topActive") {
            // Send to most active users
            const limit = topActiveCount || 10;

            // Get all users with task count, sort, and take top N
            const allUsers = await prisma.user.findMany({
                select: {
                    email: true,
                    name: true,
                    _count: {
                        select: { tasks: true },
                    },
                },
            });

            users = allUsers
                .sort((a, b) => b._count.tasks - a._count.tasks)
                .slice(0, limit)
                .map((user) => ({
                    email: user.email,
                    name: user.name,
                }));
        } else {
            return res.status(400).json({ error: "Invalid recipient type or missing data" });
        }

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
