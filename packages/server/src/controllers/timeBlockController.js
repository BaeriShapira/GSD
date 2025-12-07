import { timeBlockService } from '../services/timeBlockService.js';
import { syncTimeBlockToGoogle, handleEntityDeletion } from '../services/calendarSyncService.js';

export const timeBlockController = {
    async getAllTimeBlocks(req, res, next) {
        try {
            const userId = req.user?.id;
            const timeBlocks = await timeBlockService.getAllTimeBlocks(userId);
            res.json(timeBlocks);
        } catch (error) {
            next(error);
        }
    },

    async getTimeBlocksByDate(req, res, next) {
        try {
            const userId = req.user?.id;
            const { date } = req.query;

            if (!date) {
                return res.status(400).json({ error: 'Date parameter is required' });
            }

            const timeBlocks = await timeBlockService.getTimeBlocksByDate(userId, date);
            res.json(timeBlocks);
        } catch (error) {
            next(error);
        }
    },

    async getTimeBlockById(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            const timeBlock = await timeBlockService.getTimeBlockById(parseInt(id), userId);
            res.json(timeBlock);
        } catch (error) {
            next(error);
        }
    },

    async createTimeBlock(req, res, next) {
        try {
            const userId = req.user?.id;
            const timeBlock = await timeBlockService.createTimeBlock(userId, req.body);

            // Trigger Google Calendar sync (async, non-blocking)
            syncTimeBlockToGoogle(userId, timeBlock.id).catch(err =>
                console.error('Calendar sync error:', err)
            );

            res.status(201).json(timeBlock);
        } catch (error) {
            next(error);
        }
    },

    async updateTimeBlock(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            const timeBlock = await timeBlockService.updateTimeBlock(parseInt(id), userId, req.body);

            // Trigger Google Calendar sync (async, non-blocking)
            syncTimeBlockToGoogle(userId, timeBlock.id).catch(err =>
                console.error('Calendar sync error:', err)
            );

            res.json(timeBlock);
        } catch (error) {
            next(error);
        }
    },

    async deleteTimeBlock(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            const timeBlockId = parseInt(id);

            await timeBlockService.deleteTimeBlock(timeBlockId, userId);

            // Trigger Google Calendar deletion (async, non-blocking)
            handleEntityDeletion(userId, 'timeBlock', timeBlockId).catch(err =>
                console.error('Calendar sync error:', err)
            );

            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};
