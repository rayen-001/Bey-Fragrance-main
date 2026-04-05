import { PrismaClient } from '@prisma/client';
import "dotenv/config";

// We force the environment variable into the process before the client starts
process.env.DATABASE_URL = process.env.DATABASE_URL;

const prisma = new PrismaClient();

async function main() {
    console.log("Checking connection to Supabase...");
    try {
        // This executes a simple query to verify the 'handshake'
        await prisma.$queryRaw`SELECT 1`;
        console.log("✅ Connection Successful! Your credentials and network are working.");
    } catch (e) {
        console.error("❌ Connection Failed.");
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();