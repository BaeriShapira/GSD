-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AreaOfLife" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AreaOfLife_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AreaOfLife" ("color", "createdAt", "description", "id", "name", "userId") SELECT "color", "createdAt", "description", "id", "name", "userId" FROM "AreaOfLife";
DROP TABLE "AreaOfLife";
ALTER TABLE "new_AreaOfLife" RENAME TO "AreaOfLife";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
