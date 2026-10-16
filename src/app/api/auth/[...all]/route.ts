import { auth, saveAuthDb } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest } from "next/server";
import { logger } from "@/lib/logger";

const handlers = toNextJsHandler(auth);

export async function GET(request: NextRequest) {
  return handlers.GET(request);
}

export async function POST(request: NextRequest) {
  try {
    const response = await handlers.POST(request);
    // Best-effort persistence: serverless filesystems may be read-only.
    // Surface the failure (so it appears in logs) but never fail the request.
    try {
      saveAuthDb();
    } catch (saveErr) {
      logger.warn("saveAuthDb failed after POST", saveErr);
    }
    return response;
  } catch (handlerErr) {
    logger.error("BetterAuth POST handler failed", handlerErr);
    throw handlerErr;
  }
}
