import express from 'express';
import {
    enableCalendarSync,
    disableCalendarSync,
    getSyncStatus,
    triggerManualSync,
    disconnectCalendar,
    getSyncedItems,
} from '../controllers/calendarController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Enable calendar sync
router.post('/enable', enableCalendarSync);

// Disable calendar sync
router.post('/disable', disableCalendarSync);

// Get sync status
router.get('/status', getSyncStatus);

// Trigger manual sync
router.post('/sync', triggerManualSync);

// Disconnect Google Calendar
router.post('/disconnect', disconnectCalendar);

// Get synced items
router.get('/synced-items', getSyncedItems);

export default router;
