# UK Driver's Licence Hub

React/Vite frontend, Express API, and PostgreSQL/Drizzle database in a pnpm
workspace. The repository includes source code, static images, dependency
lockfile, API schemas, database schema, and hosting configuration.

## Deploy on Vercel

1. Import this GitHub repository into Vercel.
2. Keep **Root Directory** at the repository root, **not** either artifact folder.
3. Choose **Other** for Framework Preset and **Node.js 22.x**.
4. Use the install and build commands from `vercel.json`:
   - Install: `pnpm -r install --frozen-lockfile --prod=false`
   - Build: `pnpm -w run build:vercel`
   - Leave Output Directory unset. The build emits `.vercel/output` using
     Vercel's Build Output API; do not override it to the frontend's dist folder.
5. Set the private environment variables below for each environment you use.
6. Prepare the database schema, then deploy using Vercel.

The build packages the Vite website and a self-contained Node.js API function.
`/api/*` requests go to Express; other application paths (including `/admin`
and `/track`) fall back to the website's `index.html`. Static assets are
included. No Replit proxy, persistent web process, or `PORT` setting is required.
Builds do not connect to or modify the database.

### Fixing “Missing script: build:vercel”

This error means Vercel ran the command inside an artifact folder instead of
the repository root. In **Project Settings → Build and Deployment**:

- Clear **Root Directory** so it uses the repository root, not
  `artifacts/uk-licence`.
- Set **Framework Preset** to **Other** and **Node.js Version** to **22.x**.
- Remove old command overrides, or use the exact commands above.
- Leave **Output Directory** unset, then redeploy the latest `main` commit.

The build's `-w` option explicitly selects the workspace root.
The install's `-r` option installs all workspace packages, and `--prod=false`
includes required build tools such as Vite even in a production environment.
Do not use `-w install`: it installs only root dependencies and skips the app.
The Vercel Root Directory setting must still point to the repository root:
the complete website and API output is written to its `.vercel/output`.

### Private environment variables

| Name | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string reachable from Vercel. Use your database provider's TLS and pooling guidance. |
| `ADMIN_USERNAME` | Choose a private administrator username. |
| `ADMIN_PASSWORD` | Choose a new, strong administrator password; do not reuse the development default. |
| `NODE_ENV` | `production` |

Use Vercel's Environment Variables settings, never source files or chat, to
enter real credentials. Redeploy after changing runtime variables.
`.env.example` lists names only. Do not expose secrets using `VITE_` variables.

### Database schema and existing data

GitHub stores code, **not a running PostgreSQL service**. A new Vercel
deployment does not automatically receive this project's existing database,
application records, or licence images stored in database records.

- To retain existing records, either use an externally reachable connection to
  the existing PostgreSQL database or securely migrate a PostgreSQL backup to
  your chosen provider. Verify access from Vercel before switching traffic.
- For a new empty database, set `DATABASE_URL` privately in your terminal's
  environment and run `pnpm db:setup` from the repository root after installing
  dependencies. Review any proposed schema changes; do not force them against
  an existing database. This creates the schema, not sample or existing records.
- Keep database backups, exported applicant records, credentials, and `.env`
  files outside GitHub. Use separate databases for production and previews.

### Important before a public launch

The current application only checks the administrator password at login.
**The `/api/admin/*` endpoints do not validate sessions or tokens.**
Setting `ADMIN_PASSWORD` does not fix that. Server-side authorization must be
added before exposing this deployment with real applicant data.
This hosting configuration does not change that existing behavior.

Vercel limits function request bodies to **4.5 MB**, even though this app's
Express parser allows 20 MB. Licence uploads currently use base64 JSON, which
increases image size by approximately one third. Keep the complete request
under 4.5 MB (prefer front and back images under 1 MB each), or migrate uploads
to direct object storage before handling larger images. The function is
configured to stream responses; large input bodies remain subject to the
platform limit.

Keep any Replit deployment and domain routing unchanged until the Vercel
deployment, database access, and security have been verified. Importing or
pushing this repository does not by itself publish to Vercel or move a domain.

## Local checks

Requires Node.js 22 and pnpm 10.26.1.

```sh
pnpm install --frozen-lockfile
pnpm build:vercel
pnpm test:vercel
```

The verification command checks packaged routing, static assets, and the
compiled API in isolation. It uses a deliberately unreachable local test
database address and does not read or change applicant data.

## Existing Replit hosting

Existing Replit workflows and artifact configurations remain unchanged.
The Vercel build is an additional target, not a replacement for Replit.
