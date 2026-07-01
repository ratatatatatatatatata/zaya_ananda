// Lightweight Supabase (PostgREST) client using fetch — no extra dependency.
const URL = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/+$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseReady = !!(URL && KEY);

function assertEnv() {
  if (!URL || !KEY)
    throw new Error("Supabase тохиргоо дутуу байна. .env.local дотор SUPABASE_URL болон SUPABASE_SERVICE_ROLE_KEY-г тохируулна уу.");
}

const camelToSnake = (s: string) => s.replace(/[A-Z]/g, (m) => "_" + m.toLowerCase());
const snakeToCamel = (s: string) => s.replace(/_([a-z])/g, (_m, c) => c.toUpperCase());

export function toRow(o: Record<string, unknown>): Record<string, unknown> {
  const r: Record<string, unknown> = {};
  for (const k of Object.keys(o)) if (o[k] !== undefined) r[camelToSnake(k)] = o[k];
  return r;
}
export function fromRow<T>(o: Record<string, unknown>): T {
  const r: Record<string, unknown> = {};
  for (const k of Object.keys(o)) r[snakeToCamel(k)] = o[k];
  return r as T;
}

async function req(path: string, init?: RequestInit): Promise<unknown> {
  assertEnv();
  const res = await fetch(`${URL}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: KEY, Authorization: `Bearer ${KEY}`, "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${text.slice(0, 300)}`);
  return text ? JSON.parse(text) : null;
}

export const enc = (v: string) => encodeURIComponent(v);

export async function sbSelect<T>(table: string, query = ""): Promise<T[]> {
  const rows = (await req(`${table}?select=*${query ? `&${query}` : ""}`)) as Record<string, unknown>[];
  return (rows || []).map((r) => fromRow<T>(r));
}
export async function sbInsert<T>(table: string, row: Record<string, unknown>): Promise<T> {
  const out = (await req(table, { method: "POST", headers: { Prefer: "return=representation" }, body: JSON.stringify(toRow(row)) })) as Record<string, unknown>[];
  return fromRow<T>(out[0]);
}
export async function sbUpdate<T>(table: string, id: string, patch: Record<string, unknown>): Promise<T | null> {
  const out = (await req(`${table}?id=eq.${enc(id)}`, { method: "PATCH", headers: { Prefer: "return=representation" }, body: JSON.stringify(toRow(patch)) })) as Record<string, unknown>[];
  return out && out[0] ? fromRow<T>(out[0]) : null;
}
export async function sbDelete(table: string, id: string): Promise<void> {
  await req(`${table}?id=eq.${enc(id)}`, { method: "DELETE" });
}
