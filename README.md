# Haven

A calm web app for everyday reminders, familiar faces, personal memories, and shared family care.

## What is implemented

- Supabase email/password sign-in, email-confirmation messaging, password recovery, and protected screens.
- Account-scoped care profiles with a configurable time zone.
- Daily recurring reminders with server-recorded completion and 15-minute snooze.
- Private photo uploads, family contacts, dialer links, and personal memory stories.
- Family invitations tied to a verified email, expiring in 24 hours and usable once. Owners can revoke access.
- A persisted care activity feed and a real support-request inbox.
- Ten built-in activities. Familiar Faces reads the selected care profile's contacts.
- Live RevenueCat checkout using the exact returned package and provider prices. Test keys are rejected. No card details are collected by Haven.
- Accessible preferences, reduced-motion styling, route history, lazy-loaded screens, error recovery, and confirmed-save states.

Core care and activities are currently available without a subscription. Membership supports the app; the UI does not advertise unimplemented premium features.

## Local development

Requires Node.js 24 (the test runner uses native TypeScript stripping).

1. Run `npm ci`.
2. Copy `.env.example` to `.env` and supply your own public Supabase credentials.
3. For a new database, apply `supabase/schema.sql`, then `supabase/migrations/20261022181833_production_care.sql`.
4. For an existing Haven database, apply only the production migration.
5. Run `npm run dev`.

Checks:

```sh
npm run lint
npm test
npm run build
```

The production build includes TypeScript checking. Never put a Supabase service-role key, database password, or private payment key into a VITE_ variable.

## Required production setup

### Supabase

Apply the migration in the project's SQL Editor or with authenticated database deployment tooling. Public browser keys cannot execute migrations.

The migration adds care memberships, invitation functions, daily reminder events, activity records, support requests, profile preferences, and a private care-photos bucket. All patient-data access is constrained by RLS. The migration does not remove existing account records. The old reminders.done flag is ignored because it has no completion date; historical daily completion cannot be reconstructed from it.

Set the Auth Site URL to the deployed origin and allow redirect URLs for that origin and `/?recovery=1`. Enable email confirmation and configure production SMTP. Existing accounts default to UTC until their owner saves their care timezone.

Monitor support_requests through the Supabase dashboard using an administrator account. There is no automated email notification or promised response time.

### RevenueCat

Set VITE_REVENUECAT_API_KEY to a production Web Billing public key, configure a current offering with the intended products, and configure entitlements named haven_plus or haven_family. Prices and packages are read from that offering; trial promises are not hardcoded. Checkout is unavailable when configuration is missing, uses a test key, or the provider request fails.

The signed-in Supabase user ID is the billing customer ID. Existing memberships are recovered by refreshing customer information for that same account. Manage/cancel opens the provider management URL. No backend feature gates currently depend on membership.

### Hosting

Build with `npm run build`, publish `dist`, and set the public environment variables before building. Vercel configuration includes security headers and SPA rewrites.

## Operational boundaries

- Reminders recur daily and are visible while the app is open. No background push, SMS, emergency dispatch, or closed-app alarms are implemented.
- Snoozes and completion use the patient's profile timezone and server timestamps. Data refreshes every 30 seconds while visible and after mutations/reconnection.
- Failed writes stay visible as errors. There is no local fallback that pretends to save account data, and no offline write queue.
- Invitation codes must be shared privately by the account owner; the app does not send invitation email.
- Uploaded photos are limited to 5 MB and stored privately. Signed image URLs expire after five minutes; a previously issued link may remain usable until then after access is revoked.
- No medical treatment, regulatory certification, or clinical efficacy claim is made.
- The existing translation resources are retained; newly rebuilt screens are primarily English pending full localization review.

## Verification before live release

Run `supabase/tests/production_rls.sql` in a staging Supabase project after migration. It uses synthetic fixtures inside a rollback-only transaction. Verify with two separate real test accounts: invitation acceptance, rejection by another email, revocation, patient switching, private photo access, and reload persistence. Test provider checkout/cancellation in an isolated billing environment before enabling a production key.

Local tests cover reminder time normalization, timezone boundaries, daylight saving, snooze deadlines, completed-state handling, and safe dial links. The production care migration was applied to the connected Supabase project on 2026-10-22. Database-role tests passed for isolated access, email-bound single-use invitations, shared access, revocation, and idempotent reminder completion; all synthetic fixtures were rolled back. Existing records were retained and the private photo bucket was verified. End-to-end browser authentication, email delivery, photo uploads, billing checkout, and rendered layouts still require release verification.


### Connected backend verification (2026-10-22)

Privileged function implementations now live in a private schema, with authenticated API wrappers and explicit minimum table grants. The legacy automatic email-confirmation trigger was removed. Existing account verification timestamps were retained; these should not be treated as proof of historical email delivery.

The security advisor reports leaked-password protection disabled; enable it in Auth settings when supported by the project plan. The invitation table intentionally has no client policies or client grants: only checked functions access invitation tokens. RevenueCat administration tools were not available in this session, and the configured test key does not enable production checkout. Auth redirect URLs, email confirmation settings, and production SMTP still need dashboard verification.
