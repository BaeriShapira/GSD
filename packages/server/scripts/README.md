# Database Schema Setup Script

## Purpose

This script automatically configures the Prisma schema to use the correct database provider based on the `DATABASE_URL` environment variable.

## How it Works

1. **Reads DATABASE_URL** from environment variables
2. **Detects database type**:
   - If URL starts with `postgresql://` or `postgres://` → PostgreSQL
   - If URL starts with `file:` → SQLite
3. **Updates schema.prisma** to use the correct provider
4. **Runs automatically** before Prisma operations

## Usage

The script runs automatically via npm scripts:

```bash
npm run build         # Generates Prisma Client with correct provider
npm run db:migrate    # Runs migrations with correct provider
npm run db:push       # Pushes schema with correct provider
npm install           # Automatically runs on install (postinstall hook)
```

## Local Development (SQLite)

```bash
DATABASE_URL="file:./prisma/dev.db"
# Schema will be configured for SQLite
```

## Production (PostgreSQL on Railway)

```bash
DATABASE_URL="postgresql://user:password@host:port/database"
# Schema will be configured for PostgreSQL
```

## Why This is Needed

Prisma doesn't support environment variables in the `provider` field of `schema.prisma`. This causes issues when:
- Development uses SQLite
- Production uses PostgreSQL

Without this script, you'd get validation errors like:
```
Error: the URL must start with the protocol `file:`.
```

## Implementation

The script modifies the `datasource db { provider }` field in `schema.prisma` before running Prisma operations, ensuring the schema matches the database specified in DATABASE_URL.
