# Budgie 🦜

Budgie is a self-hosted personal budget tracker — a home for the monthly
budget spreadsheet, rebuilt as a small web app. It keeps a running month
(Start With → Monthly Debits → Planned Spend → Total Remaining), a full
history you can browse by year and month, a category system for tagging
where money goes, and a year-round Christmas gift tracker with its own
budget.

The app's source lives in this GitHub repository — clone it, run it on
your own machine or server, and push/pull as you would any other codebase.
Your budget data itself lives in your own **PostgreSQL** database, not in
git, so it never has to touch GitHub.

## Features

- **This Month** — your current month's budget: an editable starting
  balance, a list of monthly debits, a list of planned spend, and running
  totals after each, styled after the original spreadsheet's colour-coded
  bars.
- **History** — every month you've tracked, browsable by year via a
  calendar-style grid, plus a flat table for scanning totals at a glance.
- **Categories** — editable tags (Bills, Groceries, Luxury, Purchase, …)
  you can add, rename, recolour, or remove from Settings → Categories.
  Each entry can also carry free-text notes.
- **Accounts** — editable tags (e.g. "Home", "My Bills", "Extra Spends")
  from Settings → Accounts, for grouping entries by where the money
  actually needs to go. Tag entries with one to see running totals per
  account in a sidebar on the monthly page — handy for knowing how much
  to transfer where.
- **Icons** — entries and debts automatically get a little icon next to
  their name based on what they're called — a house for "Rent", a water
  drop for "Water", a phone for "O2" or "EE", recognisable brand marks
  for things like "Capital One" or "Netflix" where possible, and a
  sensible fallback otherwise. No configuration needed.
- **Copy-forward** — starting a new month can copy last month's monthly
  debits across so you're not retyping Rent, Council Tax, etc. every time.
- **Christmas** — a standalone tracker for gifts bought throughout the
  year, with an editable budget (defaults to £250) and running "spent" /
  "remaining" totals.
- **Debts** — a log for things you owe (phone contracts, credit cards,
  store cards like Argos Pay, …) and things owed to you (money from
  friends or family), each with an optional category, monthly payment,
  and end date, and a checkbox to mark it settled.
- **Logins** — everything above is private per person. Log in to see
  only your own months, categories, and Christmas list; nobody else's data
  is visible to you. The first login anyone creates becomes an
  **admin**, who can add, remove, or reset the password of further
  logins from Settings → Users; logins added afterwards are
  **standard** by default.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS
- [Prisma](https://www.prisma.io) + PostgreSQL

## Getting started

There are two ways to run Budgie: the whole thing via Docker Compose
(app + database, one command), or the app locally with `npm run dev`
against a database of your choice. Either way, start by creating your
`.env`:

```bash
cp .env.example .env
```

Then set `SESSION_SECRET`, generated with `openssl rand -base64 32`.
This signs login sessions; without a real value the app falls back to an
insecure built-in secret (fine for poking around locally, not for
anything reachable beyond your own machine).

### Option A: Docker Compose (app + database)

```bash
docker compose up -d --build
```

This builds and starts two containers:

- `budgie-db-1` — Postgres, exposed on `localhost:5343`
- `budgie-app-1` — the Next.js app, exposed on `localhost:3010`

The app container runs migrations automatically on startup. Open
[http://localhost:3010](http://localhost:3010) — since the database is
empty, you'll land on a "Create the first account" screen instead of a
login form. Whatever username and password you choose there becomes the
**admin** account, so claim it before anyone else can reach the app on
your network.

### Option B: Local dev server

Start just the database via Docker Compose:

```bash
docker compose up -d db
```

This starts Postgres on `localhost:5343` with database `budgie`, user
`budgie`, password `budgie` — matching `.env.example`. Already have your
own PostgreSQL server? Just point `DATABASE_URL` at it instead.

Then set up and run the app:

```bash
npm install
npm run db:migrate   # creates tables
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the first account
you create there becomes the admin.

## Useful scripts

| Command              | What it does                                   |
| --------------------- | ----------------------------------------------- |
| `npm run dev`          | Start the dev server                            |
| `npm run build`        | Production build                                |
| `npm run start`        | Run the production build                        |
| `npm run db:migrate`   | Create/update tables from `prisma/schema.prisma`|
| `npm run db:deploy`    | Apply migrations (for production deploys)       |
| `npm run db:studio`    | Browse/edit your data in Prisma Studio          |

## Deploying

`docker compose up -d --build` (Option A above) is the easiest way to run
Budgie on a home server or small VPS — it builds the app image and starts
both containers. Prefer to run it without Docker? Build the app
(`npm run build`) and run it (`npm run start`) on any machine with
Node.js and network access to your PostgreSQL database instead.

Every account's data is private, but there's still just the one app
instance — if you expose it beyond your local network, put it behind
HTTPS (a reverse proxy like Caddy or Nginx is the easiest way) so login
credentials and session cookies aren't sent in the clear, and make sure
`SESSION_SECRET` is a real generated value, not the built-in fallback.
Claim the first (admin) account locally before exposing the app more
widely — anyone who reaches the "Create the first account" screen before
you do becomes the admin instead.

Forking this for your own family or household? There's nothing to
rename — deploy it fresh, and whoever sets it up first just creates their
own admin account on first run.

One external call worth knowing about: for a handful of recognised
brand names (banks, phone networks, streaming services), the automatic
entry icons fetch that brand's favicon from Google's public favicon
service in the browser — no personal or financial data leaves your
instance, just the brand's own name. Every other entry gets a plain
emoji with no network request, and if the favicon fails to load for any
reason (offline, blocked), it falls back to an emoji automatically.
