import { drizzle } from "drizzle-orm/node-postgres";
import { loadEnvConfig } from "@next/env";

// Load environment variables
loadEnvConfig(process.cwd());

export const db = drizzle(process.env.DATABASE_URL!);
