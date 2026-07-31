import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let prismaClient: PrismaClient | undefined;

if (typeof window === "undefined") {
  const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL || "";
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  if (globalForPrisma.prisma && !("trilhaSoftSkill" in globalForPrisma.prisma)) {
    globalForPrisma.prisma = undefined;
  }

  prismaClient =
    globalForPrisma.prisma ??
    new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    });

  if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prismaClient;
  }
}

export const prisma = prismaClient!;
