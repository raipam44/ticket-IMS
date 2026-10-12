# Product Requirements Document (PRD)
## HelpDesk Ticket Management System

| | |
|---|---|
| **Course** | CCS112 – Application Development and Emerging Technology |
| **Deliverable** | Final Laboratory Examination |
| **Time limit** | 2 hours build + checking session |
| **Stack** | Laravel 11+, Inertia.js, React (or Vue 3), Tailwind CSS, MySQL, Railway |
| **Status** | Draft v1.0 |

---

## 1. Overview

### 1.1 Problem Statement
A small IT services office tracks support requests in a shared spreadsheet. Tickets get lost, nobody knows who reported what, and anyone can edit anyone else's entries.

### 1.2 Product Vision
A secure, publicly deployed web application that replaces the spreadsheet. Registered users log, track, and resolve their own support tickets in a fast, single-page-app-feeling interface that works on phone and desktop.

### 1.3 Goals
1. Give every ticket a clear owner.
2. Make it impossible for a user to view, edit, or delete another user's ticket.
3. Provide quick create / read / update / delete with immediate feedback.
4. Be live at a public HTTPS URL backed by a production MySQL database.

### 1.4 Non-Goals (out of scope)
- Admin / agent roles or ticket assignment
- Comments, attachments, email notifications
- Real-time updates (websockets)
- Multi-tenancy, teams, or organizations
- Public API / token auth

---

## 2. Target Users

| Persona | Description | Needs |
|---|---|---|
| **Visitor** | Unregistered person | Register and log in; be redirected to login when hitting protected pages |
| **Registered user** | Office staff member who reports issues | File tickets, see only their own, update status as work progresses, delete obsolete tickets |
| **Grader / Instructor** | Evaluates against the rubric | Live URL, demo account, readable code, clean repo history |

---

## 3. User Stories and Acceptance Criteria

| # | User Story | Acceptance Criteria |
|---|---|---|
| US1 | As a visitor, I can register and log in. | Register form validates name, email (unique), password (confirmed). Password stored hashed. Login with valid credentials lands on Dashboard. Invalid credentials show an inline error. Logout ends the session. |
| US2 | As a logged-in user, I can create a ticket with title, description, priority, status, category. | Title 5–255 chars; description ≥ 10 chars; priority ∈ {Low, Medium, High, Urgent}; status ∈ {Open, In Progress, Resolved, Closed}, default Open; category ∈ {Hardware, Software, Network, Account, Other}. `user_id` is set server-side. Redirect to index with "Ticket created." |
| US3 | As a logged-in user, I can see a paginated list of my tickets and open any ticket's details. | 10 per page. Only my tickets are listed. Details page shows all fields. Table on desktop, stacked cards on phone. Empty state when none exist. |
| US4 | As a logged-in user, I can edit or delete only tickets I own. | Edit form is pre-filled. Delete asks for confirmation. Accessing another user's ticket by changing the URL ID returns **403**. |
| US5 | As a logged-in user, I see a clear success or error message after every action. | Flash messages: "Ticket created.", "Ticket updated.", "Ticket deleted." Validation errors appear inline under each field. Messages auto-dismiss or can be closed manually. |
| US6 | As a visitor, I am redirected to login when I open any ticket page. | All `/tickets*` routes are in the `auth` middleware group and redirect to `/login`. |

---

## 4. Functional Requirements

### 4.1 Authentication
- **FR-A1** Registration, login, logout via the Laravel Breeze (Inertia + React) starter kit.
- **FR-A2** Passwords hashed with Laravel's default hasher.
- **FR-A3** Guests are redirected to `/login` on any protected route.

### 4.2 Ticket Management
- **FR-T1 Create:** form page that stores a ticket owned by the authenticated user.
- **FR-T2 Read (list):** paginated index (10/page) scoped to the current user.
- **FR-T3 Read (detail):** show page for one ticket.
- **FR-T4 Update:** edit form pre-filled with current values.
- **FR-T5 Delete:** destructive action behind a confirmation dialog.
- **FR-T6** Named resource routes via `Route::resource('tickets', TicketController::class)`.
- **FR-T7** All forms use Inertia's `useForm`.

### 4.3 Authorization
- **FR-Z1** `TicketPolicy` restricts `view`, `update`, `delete` to the owner.
- **FR-Z2** Unauthorized access returns HTTP 403.

### 4.4 Feedback and UI
- **FR-U1** Persistent nav bar: user's name, Dashboard, Tickets, **New Ticket** button, Logout.
- **FR-U2** Flash messages shared through `HandleInertiaRequests`.
- **FR-U3** Inline field errors; submit button disabled while `processing`.
- **FR-U4** Color-coded badges for priority and status.
- **FR-U5** Friendly empty state when the user has no tickets.
- **FR-U6** Responsive: cards on small screens, table on larger screens.

### 4.5 Optional Enhancements (only after all required items are done)
- Filter tickets by status / priority / category (the scenario mentions "view and filter").
- Dashboard counters by status.
- Search by title.

> **Note:** The scenario says users can "view and filter" tickets, but the user stories and rubric do not require filters. Treat filtering as a low-risk bonus implemented through query-string params and `->withQueryString()`.

---

## 5. Non-Functional Requirements

| Area | Requirement |
|---|---|
| **Security** | CSRF enabled; Blade/React output escaped (no `dangerouslySetInnerHTML`); `$fillable` mass-assignment protection; never `$request->all()`; `Rule::in()` validation; secrets only in env vars; `.env` git-ignored; `.env.example` committed |
| **Production config** | `APP_ENV=production`, `APP_DEBUG=false` |
| **Performance** | Eager/selected columns on index; pagination of 10 |
| **Compatibility** | Works at ~360px phone width through desktop; no horizontal scroll on phone |
| **Availability** | Public HTTPS URL up throughout grading; data persists across redeploys |
| **Maintainability** | Thin controllers, Form Requests for validation, Policy for authorization; regular, meaningful commits |

---

## 6. Data Model (summary)

**users** (from Breeze): id, name, email (unique), password, timestamps.

**tickets**

| Field | Type | Rules |
|---|---|---|
| id | bigint PK | auto-increment |
| user_id | FK → users.id | cascade on delete |
| title | string(255) | required, 5–255 |
| description | text | required, ≥ 10 |
| priority | string/enum | Low, Medium, High, Urgent |
| status | string/enum | Open, In Progress, Resolved, Closed; default Open |
| category | string/enum | Hardware, Software, Network, Account, Other |
| created_at / updated_at | timestamps | auto |

Full schema and code in `SPEC.md`.

---

## 7. Success Metrics (mapped to the rubric, 20 pts total)

| Criterion | Target (5 pts) | How we achieve it |
|---|---|---|
| **Functionality** | All CRUD flawless, no full reloads, `useForm` errors, input retained, button disabled while processing | Inertia links/forms only; `useForm` with `processing` and `errors` |
| **UI/UX** | Polished, consistent Tailwind, usable on phone and desktop | Shared components, responsive cards/table, flash + badges + empty state |
| **Security** | Hashed passwords, protected routes, **Policy**-based ownership, validation, secrets safe | Breeze + `TicketPolicy` + Form Requests + `.gitignore` |
| **Deployment** | Live HTTPS, production MySQL, data persists across redeploys | Railway app + Railway MySQL plugin, `migrate --force`, `npm run build` |

### Automatic deduction guards
- No `.env`, `APP_KEY`, or DB passwords in the repo (else Security capped at 1).
- Live URL available at grading time (else Deployment capped at 1).
- Student can explain every line of code (else the related criterion capped at 1 or 2).

---

## 8. Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Time (2 hours) | Incomplete CRUD | Build in the order given in `SPEC.md` §14; deploy a skeleton early |
| Mixed-content errors on Railway | Broken assets | Trust proxies + force HTTPS scheme in production |
| Committing `.env` | Security capped at 1 | Verify `.gitignore` before the first commit; run `git ls-files \| grep .env` |
| SQLite left as DB in production | Deployment capped at 3 | Set `DB_CONNECTION=mysql` and use Railway MySQL variables |
| Cannot explain code | Criterion capped | Avoid copy-pasting unknown snippets; review each file before checking |
| Debug on in production | Security reduced | Set `APP_DEBUG=false` in Railway variables |

---

## 9. Milestones (2-hour plan)

| Time | Milestone |
|---|---|
| 0:00–0:10 | Read brief and rubric; create repo; install Laravel + Breeze (React/Inertia) |
| 0:10–0:25 | Ticket migration, model, factory/seeder; push first commit |
| 0:25–0:40 | Form Requests, Policy, controller, routes |
| 0:40–1:10 | Inertia pages: Index, Create, Edit, Show; shared components |
| 1:10–1:25 | Nav bar, flash messages, badges, empty state, responsive polish |
| 1:25–1:50 | Railway deploy, MySQL, env vars, migrate, demo seed |
| 1:50–2:00 | Smoke test on live URL (incl. 403 test); prepare to explain code |

---

## 10. Definition of Done
- [ ] All six user stories pass on the **live HTTPS URL**
- [ ] Opening another user's ticket URL returns 403
- [ ] Guests are redirected to `/login`
- [ ] Flash messages and inline errors appear on every action
- [ ] Layout is usable at phone width with no horizontal scroll
- [ ] Production MySQL connected; data persists after a redeploy
- [ ] `APP_DEBUG=false`, `APP_ENV=production`
- [ ] `.env` not in repo; `.env.example` committed
- [ ] Demo account seeded and documented in the README
- [ ] Repository has multiple, meaningful commits
