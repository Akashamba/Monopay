import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { readEnv } from "@/env";
import * as authSchema from "./auth-schema";
import * as gameSchema from "./game-schema";
import * as relations from "./relations";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

function createConnection() {
  const databaseUrl = readEnv("DATABASE_URL");
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  console.log("Creating database connection...");
  try {
    const conn = postgres(databaseUrl, {
      max: 1, // Limit connections for serverless environment
      idle_timeout: 20, // Close idle connections after 20 seconds
      connect_timeout: 10, // Connection timeout after 10 seconds
    });

    // Test the connection
    conn`SELECT 1`
      .then(() => {
        console.log("Database connection successful!");
      })
      .catch((error) => {
        console.error("Database connection test failed:", error);
      });

    return conn;
  } catch (error) {
    console.error("Failed to create database connection:", error);
    throw error;
  }
}

console.log("Initializing database connection...");
const conn = globalForDb.conn ?? createConnection();
if (readEnv("NODE_ENV") !== "production") globalForDb.conn = conn;

export const db = drizzle(conn, {
  schema: {
    ...authSchema,
    ...gameSchema,
    ...relations,
  },
});
