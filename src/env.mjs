import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_ESPN_S2: z.string(),
    NEXT_PUBLIC_ESPN_SWID: z.string(),
    NEXT_PUBLIC_ESPN_S2B: z.string(),
    // NEXT_PUBLIC_ESPN_SWIDB: z.string(),
    NEXT_PUBLIC_ESPN_S2C: z.string(),
    // NEXT_PUBLIC_ESPN_SWIDC: z.string(),
    NEXT_PUBLIC_ESPN_S2D: z.string(),
    // NEXT_PUBLIC_ESPN_SWIDD: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_ESPN_S2: process.env.NEXT_PUBLIC_ESPN_S2,
    NEXT_PUBLIC_ESPN_SWID: process.env.NEXT_PUBLIC_ESPN_SWID,
    NEXT_PUBLIC_ESPN_S2B: process.env.NEXT_PUBLIC_ESPN_S2B,
    // NEXT_PUBLIC_ESPN_SWIDB: process.env.NEXT_PUBLIC_ESPN_SWIDB,
    NEXT_PUBLIC_ESPN_S2C: process.env.NEXT_PUBLIC_ESPN_S2C,
    // NEXT_PUBLIC_ESPN_SWIDC: process.env.NEXT_PUBLIC_ESPN_SWIDC,
    NEXT_PUBLIC_ESPN_S2D: process.env.NEXT_PUBLIC_ESPN_S2D,
    // NEXT_PUBLIC_ESPN_SWIDD: process.env.NEXT_PUBLIC_ESPN_SWIDD,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined.
   * `SOME_VAR: z.string()` and `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
