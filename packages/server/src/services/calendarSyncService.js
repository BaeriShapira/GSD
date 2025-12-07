import { prisma } from '../config/prisma.js';
import * as googleCalendarService from './googleCalendarService.js';

/**
 * Sync a Task to Google Calendar
 * @param {number} userId - User ID
 * @param {number} taskId - Task ID
 */
export async function syncTaskToGoogle(userId, taskId) {
    try {
        console.log(`🔄 syncTaskToGoogle called for user ${userId}, task ${taskId}`);

        // Fetch user with calendar settings
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        console.log(`📊 User sync status:`, {
            userId,
            calendarSyncEnabled: user?.calendarSyncEnabled,
            hasRefreshToken: !!user?.googleRefreshToken,
            hasAccessToken: !!user?.googleAccessToken
        });

        if (!user || !user.calendarSyncEnabled || !user.googleRefreshToken) {
            console.log(`📅 Skipping sync - user ${userId} calendar not enabled or not connected`);
            return;
        }

        // Fetch task with relations
        const task = await prisma.task.findUnique({
            where: { id: taskId },
            include: {
                project: true,
                context: true,
                areaOfLife: true,
            },
        });

        if (!task) {
            console.log(`⚠️ Task ${taskId} not found`);
            return;
        }

        // Only sync NEXT_ACTION with dueDate OR WAITING_FOR with expectedDate
        const shouldSync =
            (task.status === 'NEXT_ACTION' && task.dueDate) ||
            (task.status === 'WAITING_FOR' && task.expectedDate);

        console.log(`✅ Task sync decision:`, {
            taskId,
            status: task.status,
            hasDueDate: !!task.dueDate,
            hasExpectedDate: !!task.expectedDate,
            shouldSync
        });

        if (!shouldSync) {
            console.log(`⏭️ Task ${taskId} doesn't meet sync criteria`);
            // If task should not be synced but has a sync record, delete from Google
            const syncRecord = await findSyncRecord(userId, 'task', taskId);
            if (syncRecord) {
                await deleteFromGoogle(user, syncRecord);
            }
            return;
        }

        // Check if sync record exists
        const syncRecord = await findSyncRecord(userId, 'task', taskId);

        if (syncRecord) {
            // Update existing event
            const eventData = convertTaskToGoogleEvent(task);
            const updatedEvent = await googleCalendarService.updateEvent(
                user,
                syncRecord.googleEventId,
                eventData
            );

            // Update sync record
            await updateSyncRecord(syncRecord.id, {
                lastSyncedAt: new Date(),
                syncSource: 'gsd',
                etag: updatedEvent.etag,
            });

            console.log(`✅ Task ${taskId} updated in Google Calendar`);
        } else {
            // Create new event
            const eventData = convertTaskToGoogleEvent(task);
            const createdEvent = await googleCalendarService.createEvent(user, eventData);

            // Create sync record
            await createSyncRecord(userId, 'task', taskId, createdEvent.id, createdEvent.etag);

            console.log(`✅ Task ${taskId} created in Google Calendar`);
        }
    } catch (error) {
        console.error(`❌ Error syncing task ${taskId} to Google:`, error.message);
        // Don't throw - we don't want sync errors to break the main app
    }
}

/**
 * Sync a TimeBlock to Google Calendar
 * @param {number} userId - User ID
 * @param {number} timeBlockId - TimeBlock ID
 */
export async function syncTimeBlockToGoogle(userId, timeBlockId) {
    try {
        // Fetch user with calendar settings
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.calendarSyncEnabled || !user.googleRefreshToken) {
            console.log(`📅 Skipping sync - user ${userId} calendar not enabled or not connected`);
            return;
        }

        // Fetch time block with relations
        const timeBlock = await prisma.timeBlock.findUnique({
            where: { id: timeBlockId },
            include: {
                project: true,
                areaOfLife: true,
            },
        });

        if (!timeBlock) {
            console.log(`⚠️ TimeBlock ${timeBlockId} not found`);
            return;
        }

        console.log(`📊 TimeBlock data:`, {
            id: timeBlock.id,
            title: timeBlock.title,
            date: timeBlock.date,
            startTime: timeBlock.startTime,
            endTime: timeBlock.endTime,
            project: timeBlock.project?.name,
            areaOfLife: timeBlock.areaOfLife?.name
        });

        // Check if sync record exists
        const syncRecord = await findSyncRecord(userId, 'timeBlock', timeBlockId);

        if (syncRecord) {
            // Update existing event
            const eventData = convertTimeBlockToGoogleEvent(timeBlock);
            console.log(`📤 Updating TimeBlock event in Google:`, JSON.stringify(eventData, null, 2));
            const updatedEvent = await googleCalendarService.updateEvent(
                user,
                syncRecord.googleEventId,
                eventData
            );

            // Update sync record
            await updateSyncRecord(syncRecord.id, {
                lastSyncedAt: new Date(),
                syncSource: 'gsd',
                etag: updatedEvent.etag,
            });

            console.log(`✅ TimeBlock ${timeBlockId} updated in Google Calendar`);
        } else {
            // Create new event
            const eventData = convertTimeBlockToGoogleEvent(timeBlock);
            console.log(`📤 Sending TimeBlock event to Google:`, JSON.stringify(eventData, null, 2));
            const createdEvent = await googleCalendarService.createEvent(user, eventData);

            // Create sync record
            await createSyncRecord(userId, 'timeBlock', timeBlockId, createdEvent.id, createdEvent.etag);

            console.log(`✅ TimeBlock ${timeBlockId} created in Google Calendar`);
        }
    } catch (error) {
        console.error(`❌ Error syncing timeBlock ${timeBlockId} to Google:`, error.message);
        // Don't throw - we don't want sync errors to break the main app
    }
}

/**
 * Delete synced item from Google Calendar
 * @param {Object} user - User object
 * @param {Object} syncRecord - CalendarSync record
 */
async function deleteFromGoogle(user, syncRecord) {
    try {
        await googleCalendarService.deleteEvent(user, syncRecord.googleEventId);
        await deleteSyncRecord(syncRecord.id);
        console.log(`✅ Deleted event ${syncRecord.googleEventId} from Google Calendar`);
    } catch (error) {
        console.error(`❌ Error deleting from Google Calendar:`, error.message);
    }
}

/**
 * Handle deletion of task or time block
 * @param {number} userId - User ID
 * @param {string} entityType - 'task' or 'timeBlock'
 * @param {number} entityId - Entity ID
 */
export async function handleEntityDeletion(userId, entityType, entityId) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user || !user.calendarSyncEnabled || !user.googleRefreshToken) {
            return;
        }

        const syncRecord = await findSyncRecord(userId, entityType, entityId);
        if (syncRecord) {
            await deleteFromGoogle(user, syncRecord);
        }
    } catch (error) {
        console.error(`❌ Error handling deletion for ${entityType} ${entityId}:`, error.message);
    }
}

/**
 * Convert Task to Google Calendar event format
 */
function convertTaskToGoogleEvent(task) {
    const isNextAction = task.status === 'NEXT_ACTION';
    const isWaitingFor = task.status === 'WAITING_FOR';

    let summary = task.text;
    if (isNextAction) {
        summary = `📋 ${task.text}`;
    } else if (isWaitingFor) {
        summary = `⏳ Waiting: ${task.text}`;
    }

    // Build description
    let descriptionParts = [];
    if (isNextAction) {
        descriptionParts.push('Next Action');
    } else if (isWaitingFor) {
        descriptionParts.push(`Waiting For: ${task.waitingFor || 'N/A'}`);
    }

    if (task.project?.name) {
        descriptionParts.push(`Project: ${task.project.name}`);
    }
    if (task.context?.name) {
        descriptionParts.push(`Context: ${task.context.name}`);
    }
    if (task.areaOfLife?.name) {
        descriptionParts.push(`Area: ${task.areaOfLife.name}`);
    }
    if (task.urgency) {
        descriptionParts.push(`Urgency: ${task.urgency}`);
    }

    const description = descriptionParts.join('\n');

    // Determine date/time
    const targetDate = isNextAction ? task.dueDate : task.expectedDate;
    const dateObj = new Date(targetDate);

    // Check if time is set (not midnight UTC)
    const hasTime = dateObj.getUTCHours() !== 0 ||
                    dateObj.getUTCMinutes() !== 0 ||
                    dateObj.getUTCSeconds() !== 0;

    let start, end;
    if (hasTime) {
        // Timed event (30 minutes duration)
        start = { dateTime: dateObj.toISOString(), timeZone: 'UTC' };
        const endDate = new Date(dateObj.getTime() + 30 * 60 * 1000); // +30 minutes
        end = { dateTime: endDate.toISOString(), timeZone: 'UTC' };
    } else {
        // All-day event
        const dateString = dateObj.toISOString().split('T')[0];
        start = { date: dateString };
        end = { date: dateString };
    }

    const event = {
        summary,
        description,
        start,
        end,
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 30 }
            ]
        },
        extendedProperties: {
            private: {
                gsdType: 'task',
                gsdId: String(task.id),
                gsdStatus: task.status,
            }
        }
    };

    // Add color for waiting items
    if (isWaitingFor) {
        event.colorId = '11'; // Red
    }

    return event;
}

/**
 * Convert TimeBlock to Google Calendar event format
 */
function convertTimeBlockToGoogleEvent(timeBlock) {
    const summary = timeBlock.title || 'Time Block';

    // Build description
    let descriptionParts = [];
    if (timeBlock.project?.name) {
        descriptionParts.push(`Project: ${timeBlock.project.name}`);
    }
    if (timeBlock.areaOfLife?.name) {
        descriptionParts.push(`Area: ${timeBlock.areaOfLife.name}`);
    }
    if (timeBlock.notes) {
        descriptionParts.push(`\nNotes: ${timeBlock.notes}`);
    }

    const description = descriptionParts.join('\n');

    // Build start and end times
    // Convert DateTime to YYYY-MM-DD format
    const dateObj = new Date(timeBlock.date);
    const dateStr = dateObj.toISOString().split('T')[0]; // Format: "YYYY-MM-DD"
    const startDateTime = `${dateStr}T${timeBlock.startTime}:00`;
    const endDateTime = `${dateStr}T${timeBlock.endTime}:00`;

    const event = {
        summary,
        description,
        start: {
            dateTime: startDateTime,
            timeZone: 'UTC'
        },
        end: {
            dateTime: endDateTime,
            timeZone: 'UTC'
        },
        reminders: {
            useDefault: false,
            overrides: [
                { method: 'popup', minutes: 30 }
            ]
        },
        extendedProperties: {
            private: {
                gsdType: 'timeBlock',
                gsdId: String(timeBlock.id),
            }
        },
        colorId: '9' // Blue color for time blocks
    };

    return event;
}

/**
 * Find sync record for an entity
 */
async function findSyncRecord(userId, entityType, entityId) {
    return prisma.calendarSync.findUnique({
        where: {
            userId_entityType_entityId: {
                userId,
                entityType,
                entityId,
            }
        }
    });
}

/**
 * Create sync record
 */
async function createSyncRecord(userId, entityType, entityId, googleEventId, etag) {
    return prisma.calendarSync.create({
        data: {
            userId,
            entityType,
            entityId,
            googleEventId,
            googleCalendarId: 'primary',
            syncSource: 'gsd',
            etag: etag || null,
            lastSyncedAt: new Date(),
        }
    });
}

/**
 * Update sync record
 */
async function updateSyncRecord(syncId, data) {
    return prisma.calendarSync.update({
        where: { id: syncId },
        data,
    });
}

/**
 * Delete sync record
 */
async function deleteSyncRecord(syncId) {
    return prisma.calendarSync.delete({
        where: { id: syncId },
    });
}
