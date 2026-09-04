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
  Each entry can also carry free-text notes and an optional "account" tag
  (e.g. a person or card you're paying towards).
- **Copy-forward** — starting a new month can copy last month's monthly
  debits across so you're not retyping Rent, Council Tax, etc. every time.
- **Christmas** — a standalone tracker for gifts bought throughout the
  year, with an editable budget (defaults to £250) and running "spent" /
  "remaining" totals.

## Tech stack

- [Next.js](https://nextjs.org) (App Router) + TypeScript
- Tailwind CSS
- [Prisma](https://www.prisma.io) + PostgreSQL

## Getting started

### 1. Start a PostgreSQL database

Easiest via Docker Compose (included):

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with database `budgie`, user
`budgie`, password `budgie` — matching `.env.example`.

Already have your own PostgreSQL server? Just point `DATABASE_URL` at it
instead (see below).

### 2. Configure the app

```bash
cp .env.example .env
# edit .env if your database isn't the docker-compose default
```

### 3. Install dependencies and set up the database schema

```bash
npm install
npm run db:migrate   # creates tables
npm run db:seed      # seeds default categories + Christmas budget
```

### 4. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Useful scripts

| Command              | What it does                                   |
| --------------------- | ----------------------------------------------- |
| `npm run dev`          | Start the dev server                            |
| `npm run build`        | Production build                                |
| `npm run start`        | Run the production build                        |
| `npm run db:migrate`   | Create/update tables from `prisma/schema.prisma`|
| `npm run db:deploy`    | Apply migrations (for production deploys)       |
| `npm run db:seed`      | Seed default categories + Christmas budget      |
| `npm run db:studio`    | Browse/edit your data in Prisma Studio          |

## Deploying

Build the app (`npm run build`) and run it (`npm run start`) on any server
or VM with Node.js and network access to your PostgreSQL database — a
small VPS, a home server, or a container platform all work. Since this is
a single-user personal app, no authentication is included; put it behind
your own network/VPN or a reverse proxy with basic auth if you expose it
beyond your local network.
