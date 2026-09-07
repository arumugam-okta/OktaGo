import { createIddbClient } from "./client";

// Placeholder in-memory client — swap this import for the real published
// package once available. Env vars to be finalized; using dummy values.
export const iddb = createIddbClient({
  tenant: process.env.IDDB_TENANT ?? "dummy-tenant",
  key: process.env.IDDB_ANON_KEY ?? "dummy-anon-key",
});
