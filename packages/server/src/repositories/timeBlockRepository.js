import { prisma } from '../config/prisma.js';

export const timeBlockRepository = {
    async findAllByUser(userId) {
        return prisma.timeBlock.findMany({
            where: { userId },
            include: {
                project: {
                    include: {
                        areaOfLife: true
                    }
                },
                areaOfLife: true
            },
            orderBy: [
                { date: 'asc' },
                { startTime: 'asc' }
            ]
        });
    },

    async findByDate(userId, date) {
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        return prisma.timeBlock.findMany({
            where: {
                userId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            include: {
                project: {
                    include: {
                        areaOfLife: true
                    }
                },
                areaOfLife: true
            },
            orderBy: { startTime: 'asc' }
        });
    },

    async findById(id, userId) {
        return prisma.timeBlock.findFirst({
            where: { id, userId },
            include: {
                project: {
                    include: {
                        areaOfLife: true
                    }
                },
                areaOfLife: true
            }
        });
    },

    async create(data) {
        return prisma.timeBlock.create({
            data,
            include: {
                project: {
                    include: {
                        areaOfLife: true
                    }
                },
                areaOfLife: true
            }
        });
    },

    async update(id, userId, data) {
        return prisma.timeBlock.update({
            where: { id },
            data,
            include: {
                project: {
                    include: {
                        areaOfLife: true
                    }
                },
                areaOfLife: true
            }
        });
    },

    async delete(id, userId) {
        return prisma.timeBlock.delete({
            where: { id }
        });
    }
};
