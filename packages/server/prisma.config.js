import { defineConfig, env } from "prisma/config";
import "dotenv/config";

// Detect database provider from DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || "";
const isPostgreSQL = databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("postgres://");
const provider = isPostgreSQL ? "postgresql" : "sqlite";

console.log(`🔧 Prisma detected database provider: ${provider}`);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    provider: provider,
    url: env("DATABASE_URL"),
  },
});
