import { timeBlockRepository } from '../repositories/timeBlockRepository.js';

export const timeBlockService = {
    async getAllTimeBlocks(userId) {
        return await timeBlockRepository.findAllByUser(userId);
    },

    async getTimeBlocksByDate(userId, date) {
        return await timeBlockRepository.findByDate(userId, date);
    },

    async getTimeBlockById(id, userId) {
        const timeBlock = await timeBlockRepository.findById(id, userId);
        if (!timeBlock) {
            throw new Error('Time block not found');
        }
        return timeBlock;
    },

    async createTimeBlock(userId, data) {
        const { title, startTime, endTime, date, projectId, areaOfLifeId } = data;

        // Validation
        if (!title || !startTime || !endTime || !date) {
            throw new Error('Missing required fields');
        }

        // Validate that either projectId or areaOfLifeId is provided, but not both
        if (projectId && areaOfLifeId) {
            throw new Error('Cannot assign to both project and area');
        }

        if (!projectId && !areaOfLifeId) {
            throw new Error('Must assign to either project or area');
        }

        return await timeBlockRepository.create({
            title,
            startTime,
            endTime,
            date: new Date(date),
            userId,
            projectId: projectId || null,
            areaOfLifeId: areaOfLifeId || null
        });
    },

    async updateTimeBlock(id, userId, data) {
        // Check ownership
        await timeBlockRepository.findById(id, userId);

        const updateData = {};
        if (data.title !== undefined) updateData.title = data.title;
        if (data.startTime !== undefined) updateData.startTime = data.startTime;
        if (data.endTime !== undefined) updateData.endTime = data.endTime;
        if (data.date !== undefined) updateData.date = new Date(data.date);
        if (data.projectId !== undefined) updateData.projectId = data.projectId;
        if (data.areaOfLifeId !== undefined) updateData.areaOfLifeId = data.areaOfLifeId;

        return await timeBlockRepository.update(id, userId, updateData);
    },

    async deleteTimeBlock(id, userId) {
        // Check ownership
        await timeBlockRepository.findById(id, userId);
        return await timeBlockRepository.delete(id, userId);
    }
};
