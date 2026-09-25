import { existsSync } from "node:fs";
import { defineConfig } from "drizzle-kit";

// O drizzle-kit só lê o .env; o Next também usa .env.local
for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
