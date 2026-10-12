# HelpDesk — Ticket Management System

A secure, single-page-app-feeling support ticket manager built with **Laravel 12**, **Inertia.js**, **React 18**, **Tailwind CSS**, and **MySQL**.

## Live URL

> _Update this after Railway deployment._

## Demo Credentials

| Role | Email | Password | Details |
|---|---|---|---|
| Primary Demo | `demo@helpdesk.test` | `Demo@12345` | Seeded with 15 realistic IT tickets |
| Secondary Demo | `jane@helpdesk.test` | `Demo@12345` | Seeded with 3 tickets (for cross-user authorization tests) |

## Stack

- **Backend:** Laravel 12 (PHP 8.2+)
- **Frontend:** Inertia.js + React 18 + Tailwind CSS
- **Auth:** Laravel Breeze (Inertia/React stack)
- **Database:** SQLite (local) / MySQL (production)
- **Hosting:** Railway

## Local Setup

```bash
git clone https://github.com/raipam44/ticket-IMS.git
cd ticket-IMS

# Install PHP dependencies
composer install

# Install JS dependencies
npm install

# Configure environment
cp .env.example .env
php artisan key:generate

# Edit .env — set DB_CONNECTION=sqlite (or configure MySQL)
# For SQLite: touch database/database.sqlite

# Run migrations and seed demo data
php artisan migrate --seed

# Build frontend assets
npm run build

# Start the dev server
php artisan serve
```

Visit `http://localhost:8000` and log in with the demo credentials above.

## Features

- Register / Login / Logout (Laravel Breeze)
- Create, read, update, delete tickets (CRUD)
- Tickets scoped to the authenticated user — **users cannot see or modify each other's tickets**
- HTTP 403 returned when accessing another user's ticket by ID
- Paginated list (10 per page) with filter by status, priority, category, and title search
- Responsive: table on desktop, cards on mobile
- Flash messages for every action; inline validation errors with input retained
- Color-coded priority and status badges
- Dashboard with status counters and recent tickets

## Security

- Passwords hashed (Laravel default `hashed` cast)
- CSRF enabled (Inertia/Axios send XSRF token automatically)
- `TicketPolicy` enforces ownership for view, update, delete
- `$fillable` mass-assignment protection; `user_id` never accepted from request
- `StoreTicketRequest` / `UpdateTicketRequest` with `Rule::in()` validation
- No `$request->all()` — only `$request->validated()` used
- React escapes all output by default — no `dangerouslySetInnerHTML`
- `.env` is git-ignored; `.env.example` (no real values) is committed

## Local development with Docker

```bash
docker compose up --build
```

Visit `http://localhost:8080`. The app, MySQL, migrations, and demo seed all start automatically.

To reset the database:
```bash
docker compose down -v   # removes volumes
docker compose up --build
```

## Deployment (Railway — Docker)

The project ships a `Dockerfile` that builds a single self-contained image (Nginx + PHP-FPM via Supervisord, pre-built Vite assets). Railway detects the `Dockerfile` automatically.

### Steps

1. Push this repo to GitHub
2. On Railway: **New Project → Deploy from GitHub repo** — select this repo
3. Add a **MySQL** database service to the same project
4. Set the following environment variables on the **app service** in Railway's dashboard:

| Variable | Value |
|---|---|
| `APP_NAME` | HelpDesk |
| `APP_ENV` | production |
| `APP_DEBUG` | false |
| `APP_KEY` | _(leave blank — entrypoint generates it)_ |
| `APP_URL` | `https://<your-app>.up.railway.app` |
| `DB_CONNECTION` | mysql |
| `DB_HOST` | `${{MySQL.MYSQLHOST}}` |
| `DB_PORT` | `${{MySQL.MYSQLPORT}}` |
| `DB_DATABASE` | `${{MySQL.MYSQLDATABASE}}` |
| `DB_USERNAME` | `${{MySQL.MYSQLUSER}}` |
| `DB_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}` |
| `SESSION_DRIVER` | database |
| `LOG_CHANNEL` | stderr |

> The `${{MySQL.MYSQLHOST}}` syntax is Railway's variable reference — it pulls the value from the MySQL service automatically. Check the MySQL service Variables tab for the exact names.

5. Set the **exposed port** to `8080` in Railway's service settings
6. Deploy — Railway builds the Docker image, the entrypoint runs migrations and seeds the demo account, then starts Nginx + PHP-FPM

### What the entrypoint does on every start

```
key:generate → config:cache → route:cache → migrate --force → db:seed --force → supervisord
```

`db:seed` uses `firstOrCreate` so re-deploys never duplicate the demo account or tickets.
