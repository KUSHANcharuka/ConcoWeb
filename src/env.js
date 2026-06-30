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
    RESEND_WEBHOOK_SECRET: z.string().min(1).optional(),
    RESEND_ALLOWED_FROM_DOMAINS: z.string().min(1).optional(),
    RESEND_ALLOWED_FROM_EMAILS: z.string().min(1).optional(),

    OUTBOUND_WEBHOOK_SIGNING_KEY: z.string().min(1).optional(),
    PUSHER_APP_ID: z.string().min(1).optional(),
    PUSHER_KEY: z.string().min(1).optional(),
    PUSHER_SECRET: z.string().min(1).optional(),
    PUSHER_CLUSTER: z.string().min(1).optional(),

    R2_ACCOUNT_ID: z.string().min(1).optional(),
    R2_ACCESS_KEY_ID: z.string().min(1).optional(),
    R2_SECRET_ACCESS_KEY: z.string().min(1).optional(),
    R2_BUCKET: z.string().min(1).optional(),
    R2_PUBLIC_BASE_URL: z.string().url().optional(),
    DOCUSEAL_BASE_URL: z.string().url().optional(),
    DOCUSEAL_API_BASE_URL: z.string().url().optional(),
    DOCUSEAL_APP_BASE_URL: z.string().url().optional(),
    DOCUSEAL_API_KEY: z.string().min(1).optional(),
    DOCUSEAL_WEBHOOK_SECRET: z.string().min(1).optional(),
    DOCUSEAL_TEST_USER_EMAIL: z.string().email().optional(),

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
    NEXT_PUBLIC_PUSHER_KEY: z.string().min(1).optional(),
    NEXT_PUBLIC_PUSHER_CLUSTER: z.string().min(1).optional(),
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
    NEXT_PUBLIC_PUSHER_KEY: process.env.NEXT_PUBLIC_PUSHER_KEY,
    NEXT_PUBLIC_PUSHER_CLUSTER: process.env.NEXT_PUBLIC_PUSHER_CLUSTER,

    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,

    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_WEBHOOK_SECRET: process.env.RESEND_WEBHOOK_SECRET,
    RESEND_ALLOWED_FROM_DOMAINS: process.env.RESEND_ALLOWED_FROM_DOMAINS,
    RESEND_ALLOWED_FROM_EMAILS: process.env.RESEND_ALLOWED_FROM_EMAILS,

    OUTBOUND_WEBHOOK_SIGNING_KEY: process.env.OUTBOUND_WEBHOOK_SIGNING_KEY,
    PUSHER_APP_ID: process.env.PUSHER_APP_ID,
    PUSHER_KEY: process.env.PUSHER_KEY,
    PUSHER_SECRET: process.env.PUSHER_SECRET,
    PUSHER_CLUSTER: process.env.PUSHER_CLUSTER,

    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    R2_PUBLIC_BASE_URL: process.env.R2_PUBLIC_BASE_URL,
    DOCUSEAL_BASE_URL: process.env.DOCUSEAL_BASE_URL,
    DOCUSEAL_API_BASE_URL: process.env.DOCUSEAL_API_BASE_URL,
    DOCUSEAL_APP_BASE_URL: process.env.DOCUSEAL_APP_BASE_URL,
    DOCUSEAL_API_KEY: process.env.DOCUSEAL_API_KEY,
    DOCUSEAL_WEBHOOK_SECRET: process.env.DOCUSEAL_WEBHOOK_SECRET,
    DOCUSEAL_TEST_USER_EMAIL: process.env.DOCUSEAL_TEST_USER_EMAIL,

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
  onValidationError: (error) => {
    const fs = require('fs');
    fs.writeFileSync('env_validation_error.json', JSON.stringify(error, null, 2));
    console.error("Zod Error:", error);
    throw error;
  }
});
