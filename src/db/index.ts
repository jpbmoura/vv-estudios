import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

// Um cliente por instância: no dev o hot reload recriaria conexões a cada edição
const globalForDb = globalThis as unknown as { vvDb?: Db };

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL não configurada");
  // Vercel é serverless: poucas conexões por função; prepare=false por segurança atrás de poolers
  const client = postgres(url, { max: 1, prepare: false, idle_timeout: 20 });
  return drizzle(client, { schema });
}

/** Conexão preguiçosa: o build não quebra se o banco ainda não estiver configurado. */
export function db(): Db {
  globalForDb.vvDb ??= createDb();
  return globalForDb.vvDb;
}
