import fs from "fs";
import path from "path";
import type { User, Order, ContactMessage, CmsItem } from "@/lib/types";

interface DBShape {
  users: User[];
  orders: Order[];
  messages: ContactMessage[];
  cmsItems: CmsItem[];
}

const DB_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DB_DIR, "db.json");

function initial(): DBShape {
  return { users: [], orders: [], messages: [], cmsItems: [] };
}

function load(): DBShape {
  try {
    if (!fs.existsSync(DB_FILE)) return initial();
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    return { ...initial(), ...JSON.parse(raw) };
  } catch {
    return initial();
  }
}

function save(data: DBShape): void {
  fs.mkdirSync(DB_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Cache on the global object so the dev server's hot-reload does not
// reset our in-memory data on every request.
const globalForDb = globalThis as unknown as { __zayaDb?: DBShape };

function getDB(): DBShape {
  if (!globalForDb.__zayaDb) globalForDb.__zayaDb = load();
  return globalForDb.__zayaDb;
}

export function db(): DBShape {
  return getDB();
}

export function persist(): void {
  save(getDB());
}
