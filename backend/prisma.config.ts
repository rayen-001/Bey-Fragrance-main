import { defineConfig } from "prisma/config";
import * as dotenv from "dotenv";
dotenv.config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // For migrations (db push), we MUST use the DIRECT_URL on port 5432
    // If not doing a migration, Prisma uses DATABASE_URL at runtime (which we pass to the client constructor)
    url: process.env.DIRECT_URL!,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
