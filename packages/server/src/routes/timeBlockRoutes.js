import express from 'express';
import { timeBlockController } from '../controllers/timeBlockController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/time-blocks - Get all time blocks for user
router.get('/', timeBlockController.getAllTimeBlocks);

// GET /api/time-blocks/by-date?date=YYYY-MM-DD - Get time blocks by date
router.get('/by-date', timeBlockController.getTimeBlocksByDate);

// GET /api/time-blocks/:id - Get specific time block
router.get('/:id', timeBlockController.getTimeBlockById);

// POST /api/time-blocks - Create new time block
router.post('/', timeBlockController.createTimeBlock);

// PUT /api/time-blocks/:id - Update time block
router.put('/:id', timeBlockController.updateTimeBlock);

// DELETE /api/time-blocks/:id - Delete time block
router.delete('/:id', timeBlockController.deleteTimeBlock);

export default router;
