# Vercel deployment

The repository includes a Vite frontend **and** an Express/PostgreSQL API.
Deploying only `artifacts/uk-licence` omits the backend and Replit's routing
configuration. A successful frontend build alone is not a working full-stack deployment.

## Vercel project settings

1. Connect the repository containing these changes.
2. Set **Root Directory** to the repository root (leave the field empty), not
   `artifacts/uk-licence`.
3. Use **Other** as the framework preset. Remove old build/output overrides.
4. The committed `vercel.json` specifies the install and build commands.
   The build emits Vercel's Build Output API to `.vercel/output`; leave
   **Output Directory** unset.
5. Set Node.js to **22.x** to match the emitted backend function.
6. Add the environment variables below in Vercel's secure Environment Variables
   settings, for each deployment environment you actually use.
7. Redeploy the commit containing these changes. A build of an older commit
   will not include these fixes.

## Runtime configuration

Do not paste secret values into chat, source files, screenshots or Git.

- `DATABASE_URL`: connection string for the existing authorized PostgreSQL
  database. It must be reachable from Vercel and have the current schema.
  Replit workspace environment variables are not automatically copied to Vercel.
  Do not use an internal-only hostname. Do not copy or migrate applicant data
  to another database just to make deployment succeed.
- `ADMIN_USERNAME`: your chosen admin username.
- `ADMIN_PASSWORD`: a new, strong password. The old hard-coded password is no
  longer accepted unless explicitly configured; do not reuse it.
- `SESSION_SECRET`: a high-entropy secret of at least 32 characters.

Admin access fails closed until all admin settings are configured. Sessions use
signed bearer tokens, expire after one hour, and become invalid when credentials
or the signing secret change. Signing out clears this browser's token and
cached applicant data; it is not global token revocation.

The build does not connect to the database, run migrations or seed records.
`/api/healthz` is a process health check, not proof of database connectivity.
Database-backed requests return 503 if `DATABASE_URL` is absent.

Local deployment regression checks:

```sh
pnpm run build:vercel
pnpm --filter @workspace/api-server run test:deployment
```

## Expected routing

- `/`, `/track`, `/how-to-apply`, `/contact`, and `/admin`: frontend app.
- `/assets/*`: static built files (missing assets return 404, not HTML).
- `/api/*`: bundled Express function, never the frontend HTML fallback.

If a deployment URL redirects to Vercel sign-in, that is Vercel deployment
protection, independent of application routing. Diagnose it while signed in to
an authorized Vercel account; do not treat a successful build as a public-access test.

## Service boundaries

This is an independent assistance service, not DVLA or GOV.UK. It cannot issue
licences, confirm government decisions or offer official application tracking.
Private document images and internal notes are not returned by public tracking.
Contact submissions and email delivery remain unavailable until a real support
provider and the operator's privacy information are configured.
