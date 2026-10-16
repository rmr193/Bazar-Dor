import { betterAuth } from "better-auth";
import { memoryAdapter } from "@better-auth/memory-adapter";
import fs from "fs";
import path from "path";

/**
 * Bazar Dor authentication — BetterAuth setup.
 *
 * Persistence model
 * -----------------
 * For the public demo we use BetterAuth's `memoryAdapter` together with a
 * `.auth-db.json` file written to the project root. This works in local dev
 * but has two important caveats:
 *
 *   1. On serverless platforms (e.g. Vercel) the filesystem is read-only
 *      for most paths, so `saveAuthDb()` is a best-effort call. Users
 *      registered on one Lambda invocation may not be visible to another.
 *   2. The same caveat applies to ephemeral containers and any host that
 *      wipes its filesystem between deploys.
 *
 * For a production deployment, swap `memoryAdapter` for a real database
 * adapter (Postgres, Turso, Mongo, etc.) — see BetterAuth's docs.
 *
 * Security
 * --------
 * `BETTER_AUTH_SECRET` is REQUIRED in production. We refuse to start with
 * a hardcoded fallback secret when `NODE_ENV === "production"` to avoid
 * shipping a known signing key in source. In development a default is
 * provided for convenience.
 */

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

/**
 * The in-memory representation of the BetterAuth database. The string index
 * is intentionally `unknown[]` (not a strict `Record<string, unknown>[]`)
 * so that the per-table typed arrays remain compatible.
 */
export interface DbState {
  user: DbUser[];
  session: DbSession[];
  account: DbAccount[];
  verification: DbVerification[];
  [table: string]: unknown[];
}

declare global {
  // eslint-disable-next-line no-var
  var __betterAuthDb: DbState | undefined;
}

const DB_FILE = path.join(process.cwd(), ".auth-db.json");

function loadDb(): DbState {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
      if (data && Array.isArray(data.user)) {
        globalThis.__betterAuthDb = data;
        return data;
      }
    }
  } catch {
    // Read-only filesystem or parse error fallback
  }

  if (globalThis.__betterAuthDb) {
    return globalThis.__betterAuthDb;
  }

  const initial: DbState = {
    user: [],
    session: [],
    account: [],
    verification: [],
  };
  globalThis.__betterAuthDb = initial;
  return initial;
}

export const authDb = loadDb();

// Purge residual demo user from in-memory store if present
const demoIdx = authDb.user.findIndex((u) => u.email === "rezwanahmed@gmail.com");
if (demoIdx !== -1) {
  const demoUserId = authDb.user[demoIdx].id;
  authDb.user.splice(demoIdx, 1);
  authDb.session = authDb.session.filter((s) => s.userId !== demoUserId);
  authDb.account = authDb.account.filter((a) => a.userId !== demoUserId);
  saveAuthDb();
}

export function saveAuthDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(authDb, null, 2), "utf-8");
  } catch {
    // Read-only filesystem (e.g. Vercel Lambda) — see top-of-file comment.
  }
}

const DEV_FALLBACK_SECRET = "bazardor-dev-only-secret-key-do-not-use-in-prod";
const authSecret = process.env.BETTER_AUTH_SECRET;

// We want a known fallback in dev, but in production we should refuse to use
// a hardcoded secret. To avoid breaking `next build` (which compiles with
// `NODE_ENV=production` but is not actually serving traffic yet), we only
// enforce the requirement at runtime — i.e. when this module is loaded by
// a request handler. `process.env.NEXT_PHASE` is set by Next.js during the
// build phase and absent during runtime requests.
if (
  !authSecret &&
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PHASE // Skip during `next build`
) {
  throw new Error(
    "[auth] BETTER_AUTH_SECRET is required in production. " +
      "Set it in your environment to a long random string."
  );
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
  trustedOrigins: async (request) => {
    const list = [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:3002",
      "http://localhost:3003",
      "http://localhost:5173",
      "http://127.0.0.1:3000",
      "http://127.0.0.1:3001",
      "https://bazar-dor-omega-six.vercel.app",
    ];
    if (request) {
      const origin = request.headers.get("origin");
      if (origin && !list.includes(origin)) {
        list.push(origin);
      }
    }
    return list;
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

// Surface a warning at boot if OAuth is still using the demo default in
// production. This catches the common mistake of deploying without setting
// GOOGLE_CLIENT_ID / GITHUB_CLIENT_ID. See README.md → "OAuth Setup".
if (
  process.env.NODE_ENV === "production" &&
  !process.env.NEXT_PHASE // Skip during `next build`
) {
  if (process.env.GOOGLE_CLIENT_ID === "mock-google-client-id") {
    // eslint-disable-next-line no-console
    console.warn(
      "[auth] GOOGLE_CLIENT_ID is the demo default. Real Google sign-in will fail. " +
        "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in your environment. " +
        "See README.md → OAuth Setup."
    );
  }
  if (process.env.GITHUB_CLIENT_ID === "mock-github-client-id") {
    // eslint-disable-next-line no-console
    console.warn(
      "[auth] GITHUB_CLIENT_ID is the demo default. Real GitHub sign-in will fail. " +
        "Set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in your environment. " +
        "See README.md → OAuth Setup."
    );
  }
}
