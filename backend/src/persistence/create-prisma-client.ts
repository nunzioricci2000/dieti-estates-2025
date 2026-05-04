import { PrismaClient } from "./generated/prisma/client.js";
import type { DatabaseConfig } from "./database-config.js";

export async function createPrismaClient(
    config: DatabaseConfig,
): Promise<PrismaClient> {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    return new PrismaClient({
        adapter: new PrismaPg({ connectionString: config.url }),
    });
}
