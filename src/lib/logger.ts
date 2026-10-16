// Tiny logger. In production we only emit warn/error so the console stays
// quiet for end users; debug/info are dev-only.
const isProd = process.env.NODE_ENV === "production";

export const logger = {
  debug(msg: string, meta?: unknown) {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.debug(`[debug] ${msg}`, meta ?? "");
  },
  info(msg: string, meta?: unknown) {
    if (isProd) return;
    // eslint-disable-next-line no-console
    console.info(`[info] ${msg}`, meta ?? "");
  },
  warn(msg: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.warn(`[warn] ${msg}`, meta ?? "");
  },
  error(msg: string, meta?: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[error] ${msg}`, meta ?? "");
  },
};
