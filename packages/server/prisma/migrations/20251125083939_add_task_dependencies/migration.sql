-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Task" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "text" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'BUCKET',
    "userId" INTEGER NOT NULL,
    "folderId" INTEGER,
    "areaOfLifeId" INTEGER,
    "labels" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "waitingFor" TEXT,
    "expectedDate" DATETIME,
    "lastNudgedAt" DATETIME,
    "projectId" INTEGER,
    "contextId" INTEGER,
    "urgency" INTEGER,
    "estimatedTime" INTEGER,
    "dueDate" DATETIME,
    "blockedByTaskId" INTEGER,
    CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Task_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "ReferenceFolder" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Task_areaOfLifeId_fkey" FOREIGN KEY ("areaOfLifeId") REFERENCES "AreaOfLife" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_contextId_fkey" FOREIGN KEY ("contextId") REFERENCES "Context" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Task_blockedByTaskId_fkey" FOREIGN KEY ("blockedByTaskId") REFERENCES "Task" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Task" ("areaOfLifeId", "contextId", "createdAt", "dueDate", "estimatedTime", "expectedDate", "folderId", "id", "labels", "lastNudgedAt", "projectId", "sortOrder", "status", "text", "urgency", "userId", "waitingFor") SELECT "areaOfLifeId", "contextId", "createdAt", "dueDate", "estimatedTime", "expectedDate", "folderId", "id", "labels", "lastNudgedAt", "projectId", "sortOrder", "status", "text", "urgency", "userId", "waitingFor" FROM "Task";
DROP TABLE "Task";
ALTER TABLE "new_Task" RENAME TO "Task";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
