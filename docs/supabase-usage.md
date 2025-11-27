## Supabase usage inventory

### Auth flows
- `src/utils/auth-helpers/server.ts` and `src/utils/auth-helpers/client.ts` call `supabase.auth` for sign-in/out, sign-up, OTP, password/email updates, metadata updates, and OAuth callbacks.
- `src/app/auth/callback/route.ts` and `src/app/auth/reset-password/route.ts` exchange Supabase auth codes for sessions.
- `src/utils/supabase/middleware.ts` checks/refreshes sessions in `src/middleware.ts`.
- `src/app/providers/init-data.tsx` hydrates the global store with the currently authenticated user.

### Billing + Stripe
- `src/utils/stripe/server.ts` creates checkout sessions and billing portals after pulling the current Supabase auth user.
- `src/utils/supabase/admin.ts` mirrors Stripe products/prices/subscriptions/customers into Supabase tables.

### Resume CRUD + sharing
- `src/utils/supabase/queries.ts` implements all resume CRUD (`resumes` table) plus helpers for `users`, `subscriptions`, `products/prices`.
- `src/store/resume/useResumeListStore.ts` uses those helpers for stateful CRUD.
- `src/components/blocks/workbench/editor/ShareBtn.tsx` toggles `resumes.is_public` and `public_password`.
- `src/app/app/resumes-preview/[id]/page.tsx` fetches individual resumes for the public preview route.
- `src/app/account/info/setting/page.tsx` updates `users` row + Supabase auth metadata for profile info.

### Misc
- `src/utils/supabase/client.ts` / `server.ts` factories wrap `@supabase/ssr`.
- `src/utils/supabase/middleware.ts` + `src/middleware.ts` guard Next.js routes.
- `src/app/providers/init-data.tsx` relies on `getUser`.

## Schema references for Prisma

- Primary reference: `supabase/schemas/resumes.sql` (custom table with JSON text columns, `is_public`, `public_password`).
- Historical context: `supabase/migrations/20230530034630_init.sql` defines `users`, `customers`, `products`, `prices`, `subscriptions` and row-level policies, plus trigger `handle_new_user`.
- Additional patches: `supabase/migrations/20250423091259_create_resumes_table.sql` and `20250605123055_resumes_update.sql`.
- `types_db.ts` contains generated TypeScript types from Supabase that reflect current column names and relationships.

Use the schema files as the canonical source when modeling the Prisma schema; migrations add `is_public` & `public_password` fields that are not in `supabase/schemas/resumes.sql`.

### Table cheat sheet

| Table | Source | Key columns / relationships | Notes |
| --- | --- | --- | --- |
| `users` | `schema.sql` | `id (uuid, pk, references auth.users)`, `full_name`, `avatar_url`, `billing_address jsonb`, `payment_method jsonb` | Trigger `handle_new_user` (also in `schema.sql`) keeps this table in sync with Supabase Auth metadata. |
| `customers` | `schema.sql` | `id (uuid, pk, references auth.users)`, `stripe_customer_id` | Private mapping used by Stripe webhooks (`createOrRetrieveCustomer`). |
| `products` | `schema.sql` | `id`, `active`, `name`, `description`, `image`, `metadata jsonb` | Public read; synced from Stripe via `upsertProductRecord`. |
| `prices` | `schema.sql` | `id`, `product_id` (FK), `active`, `currency`, `type`, `interval`, `unit_amount`, `trial_period_days`, `metadata` | Public read; `pricing_type` and `pricing_plan_interval` enums defined in same file. |
| `subscriptions` | `schema.sql` | `id`, `user_id` (FK), `status`, `metadata`, `price_id` (FK), `quantity`, `cancel_at_period_end`, timestamp columns, `trial_*` columns | Row level security restricts to owner; mutated via Stripe webhooks (`manageSubscriptionStatusChange`). |
| `resumes` | `supabase/schemas/resumes.sql` + `20250605123055_resumes_update.sql` | `id`, `user_id` (FK), `template_id`, `title`, JSON/text blobs (`basic`, `custom_data`, `education`, `experience`, `global_settings`, `menu_sections`, `projects`, `skill_content`), timestamps, `is_public`, `public_password` | Public read policy in Supabase. Prisma will need JSON columns mapped to `Json` plus optional text fields. |

### Other schema artifacts

- `supabase/seed.sql` contains seed rows for `auth`, `storage`, etc.—handy for default data but not required for Prisma modeling.
- `supabase/migrations/20230530034630_init.sql` mirrors `schema.sql` plus publications, enums, and row-level security statements; use it to ensure Prisma migrations don’t drop required policies/triggers.
- `types_db.ts` is generated from the Supabase schema (`npm run supabase:generate-types`) and can be cross-referenced to ensure Prisma models maintain column naming and nullability.

