import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Determine which provider to use based on DATABASE_URL
const databaseUrl = process.env.DATABASE_URL || '';
const isPostgreSQL = databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://');
const provider = isPostgreSQL ? 'postgresql' : 'sqlite';

console.log(`🔧 Setting up Prisma schema for ${provider.toUpperCase()}`);
console.log(`   DATABASE_URL starts with: ${databaseUrl.split(':')[0]}:`);

// Read the base schema
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');
let schema = fs.readFileSync(schemaPath, 'utf-8');

// Replace the provider
const updatedSchema = schema.replace(
    /provider\s*=\s*"(sqlite|postgresql)"/,
    `provider = "${provider}"`
);

// Only write if changed
if (schema !== updatedSchema) {
    fs.writeFileSync(schemaPath, updatedSchema, 'utf-8');
    console.log(`✅ Updated schema.prisma provider to: ${provider}`);
} else {
    console.log(`✅ Schema already configured for: ${provider}`);
}
