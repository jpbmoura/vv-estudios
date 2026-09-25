import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const SESSION_COOKIE = "vv_adm";
const SESSION_DAYS = 7;

// Senha mockada, pedida pelo cliente; ADMIN_PASSWORD permite trocar sem mexer no código
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "pipoca123";

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (s) return s;
  if (process.env.NODE_ENV === "production") throw new Error("ADMIN_SECRET não configurada");
  return "dev-secret-nao-usar-em-producao";
}

const enc = new TextEncoder();

async function sign(value: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(value));
  return Buffer.from(sig).toString("base64url");
}

/** Compara sem vazar, pelo tempo de resposta, quantos caracteres bateram */
function safeEqual(a: string, b: string) {
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  for (let i = 0; i < Math.max(ab.length, bb.length); i++) diff |= (ab[i] ?? 0) ^ (bb[i] ?? 0);
  return diff === 0;
}

export function checkPassword(password: string) {
  return safeEqual(password, ADMIN_PASSWORD);
}

export async function createSession() {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = String(expires);
  (await cookies()).set(SESSION_COOKIE, `${payload}.${await sign(payload)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/adm",
    expires: new Date(expires),
  });
}

export async function destroySession() {
  (await cookies()).delete({ name: SESSION_COOKIE, path: "/adm" });
}

export async function isAdmin() {
  const value = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!value) return false;
  const [payload, sig] = value.split(".");
  if (!payload || !sig || !safeEqual(sig, await sign(payload))) return false;
  return Number(payload) > Date.now();
}

/** Toda página e server action do painel passa por aqui (o proxy é só uma checagem otimista) */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/adm/login");
}
