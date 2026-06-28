import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    NODE_ENV: z.enum(["development", "test", "production"]),
    DATABASE_URL: z.string().url(),

    CLERK_SECRET_KEY: z.string().min(1),
    CLERK_WEBHOOK_SIGNING_SECRET: z.string().min(1),
    CLERK_CONCOLABS_ORG_ID: z.string().min(1),

    STRIPE_SECRET_KEY: z.string().min(1).optional(),
    STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),

    RESEND_API_KEY: z.string().min(1).optional(),

    OUTBOUND_WEBHOOK_SIGNING_KEY: z.string().min(1).optional(),

    R2_ACCOUNT_ID: z.string().min(1).optional(),
    R2_ACCESS_KEY_ID: z.string().min(1).optional(),
    R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    R2_BUCKET: z.string().min(1).optional(),
    R2_PUBLIC_BASE_URL: z.string().url().optional(),
    DOCUSEAL_BASE_URL: z.string().url().optional(),
    DOCUSEAL_API_KEY: z.string().min(1).optional(),
    DOCUSEAL_WEBHOOK_SECRET: z.string().min(1).optional(),

    APP_URL: z.string().url(),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().min(1),
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: z.string().default("/sign-in"),
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: z.string().default("/sign-up"),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,

    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    CLERK_WEBHOOK_SIGNING_SECRET: process.env.CLERK_WEBHOOK_SIGNING_SECRET,
    CLERK_CONCOLABS_ORG_ID: process.env.CLERK_CONCOLABS_ORG_ID,
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    RESEND_API_KEY: process.env.RESEND_API_KEY,

    OUTBOUND_WEBHOOK_SIGNING_KEY: process.env.OUTBOUND_WEBHOOK_SIGNING_KEY,

    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL,
    DOCUSEAL_BASE_URL: process.env.DOCUSEAL_BASE_URL,
    DOCUSEAL_API_KEY: process.env.DOCUSEAL_API_KEY,
    DOCUSEAL_WEBHOOK_SECRET: process.env.DOCUSEAL_WEBHOOK_SECRET,

    APP_URL: process.env.APP_URL,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
