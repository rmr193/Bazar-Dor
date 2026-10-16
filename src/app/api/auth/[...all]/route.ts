import { auth, saveAuthDb } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { logger } from "@/lib/logger";

const handlers = toNextJsHandler(auth);

export const GET = handlers.GET;

// Wrap POST so we can persist the in-memory DB after every mutating request.
// `saveAuthDb` is best-effort (serverless filesystems are read-only); we log
// but never fail the response.
export const POST = async (request: Request) => {
  try {
    return await handlers.POST(request);
  } finally {
    try {
      saveAuthDb();
    } catch (err) {
      logger.warn("saveAuthDb failed after POST", err);
    }
  }
};
