import "server-only";
import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getDatabase } from "./store";
const cookieName = "paritins_admin";
const digest = (value: string) =>
  createHash("sha256").update(value).digest("hex");
const same = (a: string, b: string) =>
  timingSafeEqual(Buffer.from(digest(a)), Buffer.from(digest(b)));
export async function getAdmin() {
  const token = (await cookies()).get(cookieName)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const row = getDatabase()
    .prepare("SELECT username FROM sessions WHERE token_hash=? AND expires_at>?")
    .get(digest(token), Date.now()) as { username: string } | undefined;
  return row || null;
}
export async function requireAdmin() {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return admin;
}
export async function signIn(
  username: string,
  password: string,
): Promise<string | null> {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedUser || !expectedPassword)
    return "Painel desativado: defina ADMIN_USER e ADMIN_PASSWORD no .env.";
  const db = getDatabase();
  const now = Date.now();
  db.prepare("DELETE FROM login_limits WHERE expires_at<?").run(now);
  const keys = ["global", `account:${digest(username)}`];
  for (const key of keys) {
    const rate = db
      .prepare("SELECT attempts FROM login_limits WHERE key=?")
      .get(key) as { attempts: number } | undefined;
    if (rate && rate.attempts >= (key === "global" ? 100 : 8))
      return "Muitas tentativas. Aguarde 15 minutos e tente novamente.";
  }
  for (const key of keys)
    db.prepare(
      "INSERT INTO login_limits(key,attempts,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET attempts=attempts+1",
    ).run(key, now + 15 * 60 * 1000);
  const userOk = same(username, expectedUser);
  const passOk = same(password, expectedPassword);
  if (!userOk || !passOk) return "Usuário ou senha inválidos.";
  db.prepare("DELETE FROM login_limits WHERE key=?").run(keys[1]);
  db.prepare("DELETE FROM sessions WHERE expires_at<?").run(now);
  const jar = await cookies();
  const oldToken = jar.get(cookieName)?.value;
  if (oldToken)
    db.prepare("DELETE FROM sessions WHERE token_hash=?").run(digest(oldToken));
  const token = randomBytes(32).toString("hex");
  db.prepare(
    "INSERT INTO sessions(token_hash,username,expires_at) VALUES (?,?,?)",
  ).run(digest(token), username, now + 8 * 60 * 60 * 1000);
  jar.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return null;
}
export async function signOut() {
  const jar = await cookies();
  const token = jar.get(cookieName)?.value;
  if (token)
    getDatabase()
      .prepare("DELETE FROM sessions WHERE token_hash=?")
      .run(digest(token));
  jar.delete(cookieName);
}
