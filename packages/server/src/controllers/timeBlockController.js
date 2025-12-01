import { timeBlockService } from '../services/timeBlockService.js';

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
            res.json(timeBlock);
        } catch (error) {
            next(error);
        }
    },

    async deleteTimeBlock(req, res, next) {
        try {
            const userId = req.user?.id;
            const { id } = req.params;
            await timeBlockService.deleteTimeBlock(parseInt(id), userId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
};
