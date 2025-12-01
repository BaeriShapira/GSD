-- AlterTable
ALTER TABLE "Task" ADD COLUMN "expectedDate" DATETIME;
ALTER TABLE "Task" ADD COLUMN "lastNudgedAt" DATETIME;
ALTER TABLE "Task" ADD COLUMN "waitingFor" TEXT;
