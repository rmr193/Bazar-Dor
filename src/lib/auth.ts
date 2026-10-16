import { betterAuth } from "better-auth";
import { memoryAdapter } from "@better-auth/memory-adapter";
import fs from "fs";
import path from "path";

// Bazar Dor uses BetterAuth with the in-memory adapter, persisted to a JSON
// file for local dev. On serverless hosts (Vercel) the filesystem is usually
// read-only, so `saveAuthDb()` is best-effort — new users won't persist
// across deployments. For production, swap the adapter for a real database.

export interface DbUser {
  id: string;
  name: string;
  email: string;
  emailVerified?: boolean;
  image?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DbSession {
  id: string;
  userId: string;
  expiresAt: string | Date;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DbAccount {
  id: string;
  userId: string;
  providerId: string;
  accountId: string;
  password?: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  idToken?: string | null;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DbVerification {
  id: string;
  identifier: string;
  value: string;
  expiresAt: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export interface DbState {
  user: DbUser[];
  session: DbSession[];
  account: DbAccount[];
  verification: DbVerification[];
  [table: string]: DbUser[] | DbSession[] | DbAccount[] | DbVerification[];
}

declare global {
  // eslint-disable-next-line no-var
  var __betterAuthDb: DbState | undefined;
}

const DB_FILE = path.join(process.cwd(), ".auth-db.json");

function loadDb(): DbState {
  if (globalThis.__betterAuthDb) return globalThis.__betterAuthDb;
  try {
    const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
    if (data && Array.isArray(data.user)) {
      globalThis.__betterAuthDb = data;
      return data;
    }
  } catch {
    // File missing or unreadable — fall through to initial state.
  }
  globalThis.__betterAuthDb = { user: [], session: [], account: [], verification: [] };
  return globalThis.__betterAuthDb;
}

export const authDb = loadDb();

export function saveAuthDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(authDb, null, 2), "utf-8");
  } catch {
    // Read-only filesystem (e.g. Vercel Lambda).
  }
}

const DEV_FALLBACK_SECRET = "bazardor-dev-only-secret-key-do-not-use-in-prod";
const authSecret = process.env.BETTER_AUTH_SECRET;

// In production we refuse to start with the demo secret. `NEXT_PHASE` is
// set by Next.js during `next build` and absent at runtime, so the build
// still works without the env var.
if (
  !authSecret &&
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PHASE
) {
  throw new Error(
    "[auth] BETTER_AUTH_SECRET is required in production. " +
      "Set it in your environment to a long random string."
  );
}

function warnIfMock(name: string, value: string | undefined) {
  if (value && value.startsWith("mock-")) {
    // eslint-disable-next-line no-console
    console.warn(
      `[auth] ${name} is the demo default. Real ${name.replace("_CLIENT_ID", "").toLowerCase()} sign-in will fail. See README.md → OAuth Setup.`
    );
  }
}

export const auth = betterAuth({
  secret: authSecret || DEV_FALLBACK_SECRET,
  baseURL: {
    fallback:
      process.env.BETTER_AUTH_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000",
    allowedHosts: [
      "localhost:*",
      "127.0.0.1:*",
      "*.vercel.app",
      "bazar-dor-omega-six.vercel.app",
    ],
  },
  database: memoryAdapter(authDb),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 6,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "mock-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock-google-client-secret",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "mock-github-client-id",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "mock-github-client-secret",
    },
  },
  user: {
    additionalFields: {
      createdAt: { type: "string", required: false },
    },
  },
});

// Catch the common deployment mistake of forgetting to set OAuth env vars.
if (process.env.NODE_ENV === "production" && !process.env.NEXT_PHASE) {
  warnIfMock("GOOGLE_CLIENT_ID", process.env.GOOGLE_CLIENT_ID);
  warnIfMock("GITHUB_CLIENT_ID", process.env.GITHUB_CLIENT_ID);
}
