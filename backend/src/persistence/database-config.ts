export type DatabaseProvider = "postgresql" | "sqlite";

export interface DatabaseConfig {
    provider: DatabaseProvider;
    url: string;
}

export function databaseConfigFromEnv(): DatabaseConfig {
    const raw = process.env["DATABASE_PROVIDER"];
    const provider: DatabaseProvider =
        raw === "sqlite" ? "sqlite" : "postgresql";
    const url = process.env["DATABASE_URL"];

    if (!url) {
        throw new Error(
            "Missing DATABASE_URL environment variable. Create a .env file or export DATABASE_URL before starting the backend.",
        );
    }

    return {
        provider,
        url,
    };
}
