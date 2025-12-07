import { prisma } from '../config/prisma.js';
import { syncTaskToGoogle, syncTimeBlockToGoogle } from '../services/calendarSyncService.js';

/**
 * Enable Google Calendar sync for user
 */
export async function enableCalendarSync(req, res, next) {
    try {
        const userId = req.user.id;

        // Check if user has Google tokens
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user.googleRefreshToken) {
            return res.status(400).json({
                error: 'Please connect your Google account first by logging in with Google'
            });
        }

        // Enable calendar sync
        await prisma.user.update({
            where: { id: userId },
            data: { calendarSyncEnabled: true },
        });

        res.json({
            success: true,
            message: 'Calendar sync enabled successfully'
        });
    } catch (error) {
        console.error('Error enabling calendar sync:', error);
        next(error);
    }
}

/**
 * Disable Google Calendar sync for user
 */
export async function disableCalendarSync(req, res, next) {
    try {
        const userId = req.user.id;

        // Disable calendar sync
        await prisma.user.update({
            where: { id: userId },
            data: { calendarSyncEnabled: false },
        });

        res.json({
            success: true,
            message: 'Calendar sync disabled successfully'
        });
    } catch (error) {
        console.error('Error disabling calendar sync:', error);
        next(error);
    }
}

/**
 * Get calendar sync status
 */
export async function getSyncStatus(req, res, next) {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                calendarSyncEnabled: true,
                googleRefreshToken: true,
                lastCalendarSync: true,
                googleCalendarId: true,
            },
        });

        const syncedItems = await prisma.calendarSync.count({
            where: { userId },
        });

        res.json({
            enabled: user.calendarSyncEnabled,
            connected: !!user.googleRefreshToken,
            lastSync: user.lastCalendarSync,
            calendarId: user.googleCalendarId,
            syncedItemsCount: syncedItems,
        });
    } catch (error) {
        console.error('Error getting sync status:', error);
        next(error);
    }
}

/**
 * Trigger manual sync of all tasks and time blocks
 */
export async function triggerManualSync(req, res, next) {
    try {
        const userId = req.user.id;

        // Check if sync is enabled
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user.calendarSyncEnabled || !user.googleRefreshToken) {
            return res.status(400).json({
                error: 'Calendar sync is not enabled or Google account not connected'
            });
        }

        // Get all tasks that should be synced (NEXT_ACTION with dueDate or WAITING_FOR with expectedDate)
        const tasks = await prisma.task.findMany({
            where: {
                userId,
                OR: [
                    { status: 'NEXT_ACTION', dueDate: { not: null } },
                    { status: 'WAITING_FOR', expectedDate: { not: null } },
                ],
            },
        });

        // Get all time blocks
        const timeBlocks = await prisma.timeBlock.findMany({
            where: { userId },
        });

        // Trigger sync for all items (async, non-blocking)
        const syncPromises = [
            ...tasks.map(task => syncTaskToGoogle(userId, task.id).catch(err =>
                console.error(`Error syncing task ${task.id}:`, err)
            )),
            ...timeBlocks.map(tb => syncTimeBlockToGoogle(userId, tb.id).catch(err =>
                console.error(`Error syncing timeBlock ${tb.id}:`, err)
            )),
        ];

        // Wait for all sync operations
        await Promise.allSettled(syncPromises);

        // Update last sync time
        await prisma.user.update({
            where: { id: userId },
            data: { lastCalendarSync: new Date() },
        });

        res.json({
            success: true,
            message: `Synced ${tasks.length} tasks and ${timeBlocks.length} time blocks`,
            tasksCount: tasks.length,
            timeBlocksCount: timeBlocks.length,
        });
    } catch (error) {
        console.error('Error in manual sync:', error);
        next(error);
    }
}

/**
 * Disconnect Google Calendar
 */
export async function disconnectCalendar(req, res, next) {
    try {
        const userId = req.user.id;

        // Clear Google tokens and disable sync
        await prisma.user.update({
            where: { id: userId },
            data: {
                googleRefreshToken: null,
                googleAccessToken: null,
                googleTokenExpiry: null,
                googleCalendarId: null,
                calendarSyncEnabled: false,
                lastCalendarSync: null,
            },
        });

        // Delete all sync records
        await prisma.calendarSync.deleteMany({
            where: { userId },
        });

        res.json({
            success: true,
            message: 'Google Calendar disconnected successfully'
        });
    } catch (error) {
        console.error('Error disconnecting calendar:', error);
        next(error);
    }
}

/**
 * Get list of synced items
 */
export async function getSyncedItems(req, res, next) {
    try {
        const userId = req.user.id;

        const syncedItems = await prisma.calendarSync.findMany({
            where: { userId },
            orderBy: { lastSyncedAt: 'desc' },
        });

        res.json(syncedItems);
    } catch (error) {
        console.error('Error getting synced items:', error);
        next(error);
    }
}
