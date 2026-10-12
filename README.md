# HelpDesk — Ticket Management System

A secure, single-page-app-feeling support ticket manager built with **Laravel 12**, **Inertia.js**, **React 18**, **Tailwind CSS**, and **MySQL**.

## Live URL

> _Update this after Railway deployment._

## Demo Credentials

| Field    | Value               |
|----------|---------------------|
| Email    | demo@helpdesk.test  |
| Password | Demo@12345          |

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

## Deployment (Railway)

1. Create a Railway project from this GitHub repo
2. Add a MySQL service to the project
3. Set environment variables in the Railway dashboard (see `SPEC.md §11.2`)
4. Build command: `composer install --no-dev --optimize-autoloader && npm ci && npm run build`
5. Start command: `php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT`
