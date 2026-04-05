import { PrismaClient } from '../../generated/prisma/index.js'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// We wrap the PrismaClient in a Proxy so it's only initialized 
// when the app actually tries to use it for the first time.
// This ensures process.env.DATABASE_URL is loaded before connecting.
let instance: PrismaClient | null = null;

export const prisma = new Proxy({} as PrismaClient, {
  get: (target, prop, receiver) => {
    if (!instance) {
      console.log('🔗 Initializing Prisma connection pool...');
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('DATABASE_URL is not defined in environment variables');
      }
      const pool = new Pool({ connectionString });
      const adapter = new PrismaPg(pool as any);
      instance = new PrismaClient({ adapter });
    }
    return Reflect.get(instance, prop, receiver);
  }
});

