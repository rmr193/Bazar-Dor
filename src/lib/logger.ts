/**
 * Centralized logger for Bazar Dor.
 *
 * Behaviour:
 * - In development, all log levels (debug/info/warn/error) are forwarded to the console.
 * - In production, only `warn` and `error` are forwarded, so we don't leak noisy
 *   diagnostics to end users. Errors always log so they remain visible during incidents.
 *
 * Usage:
 *   import { logger } from "@/lib/logger";
 *   logger.error("Product load failed", err);
 */

type LogLevel = "debug" | "info" | "warn" | "error";

const isProd = process.env.NODE_ENV === "production";

function format(level: LogLevel, message: string, meta?: unknown): unknown[] {
  const timestamp = new Date().toISOString();
  if (meta === undefined) {
    return [`[${timestamp}] [${level.toUpperCase()}] ${message}`];
  }
  return [`[${timestamp}] [${level.toUpperCase()}] ${message}`, meta];
}

export const logger = {
  debug(message: string, meta?: unknown): void {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.debug(...format("debug", message, meta));
  },
  info(message: string, meta?: unknown): void {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.info(...format("info", message, meta));
  },
  warn(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.warn(...format("warn", message, meta));
  },
  error(message: string, meta?: unknown): void {
    // eslint-disable-next-line no-console
    console.error(...format("error", message, meta));
  },
};

export default logger;
