# Haven

Haven helps people organize daily routines, familiar faces, personal memories, and shared family care in a calm, accessible interface.

## Features

- Email/password accounts and password recovery
- Daily reminders with completion tracking and snooze
- Personal memories and private photo uploads
- Family contacts and phone dialer links
- Invitations for trusted helpers, with revocable access
- Care activity history and built-in activities
- Adjustable text size and reduced-motion support

## Development

Requires Node.js 24.

1. Run `npm ci`.
2. Copy `.env.example` to `.env` and supply your own project configuration.
3. For a fresh database, apply `supabase/schema.sql`, then the migrations in `supabase/migrations` in order. For an existing database, apply only migrations that are not already recorded.
4. Run `npm run dev`.

```sh
npm run lint
npm test
npm run build
```

The build includes TypeScript checks and produces `dist` for hosting. Configure production environment variables through your hosting provider before building.

## Configuration and privacy

Do not commit environment files, account credentials, database passwords, private API keys, user exports, or payment secrets. `.env.example` contains placeholders only. Values prefixed with `VITE_` are included in the browser bundle: use only public client configuration there. Database permissions must protect user data independently of browser keys.

Use your own authentication redirect URLs and email delivery configuration. Billing requires a configured production provider account and offering; a successful build does not verify payments. Core care features are available without membership.

## Scope

Reminders repeat daily and require the app to be open; background notifications and emergency response are not implemented. Invitations are shared privately by the account owner. Uploaded photos use expiring signed links. Some screens are currently English-only.

Before release, verify authentication, email delivery, caregiver invitations and revocation, uploads, reminder timezone behavior, and checkout using dedicated test accounts. Database permission tests are in `supabase/tests`; run them in staging. Haven is an organizational aid, not an emergency or clinical service.

## License

See [LICENSE](LICENSE).
