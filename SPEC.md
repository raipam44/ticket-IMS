# Technical Specification
## HelpDesk Ticket Management System

Companion to `PRD.md`. This document defines *how* the system is built.

---

## 1. Architecture

```
Browser (React + Inertia + Tailwind)
        │  Inertia visits (XHR, X-Inertia header) – no full reloads
        ▼
Laravel 11+ (routes → middleware → controller → Form Request / Policy → Eloquent)
        │
        ▼
MySQL (Railway)
```

- **Backend:** Laravel 11+, PHP 8.2+
- **Frontend:** Inertia.js + React 18 (Vue 3 is equally acceptable; examples here use React)
- **Starter kit:** Laravel Breeze, Inertia + React stack
- **Styling:** Tailwind CSS only (no Bootstrap, no inline `style` blocks)
- **Database:** SQLite locally is fine; MySQL in production
- **Hosting:** Railway (app service + MySQL service)

### MVC responsibilities
| Layer | Responsibility |
|---|---|
| Route | `Route::resource` inside `auth` group |
| Controller | Thin: call policy, call model, return `Inertia::render` or redirect with flash |
| Form Request | All validation + `Rule::in()` |
| Policy | Owner-only `view`, `update`, `delete` |
| Model | `$fillable`, relations, casts |
| Inertia page | Presentation and `useForm` |

---

## 2. Project Setup

```bash
composer create-project laravel/laravel helpdesk
cd helpdesk
composer require laravel/breeze --dev
php artisan breeze:install react        # choose Inertia + React
npm install && npm run build
git init && git add . && git commit -m "chore: scaffold Laravel + Breeze (React)"
```

Before the **first** commit, confirm `.gitignore` contains `.env` (Laravel's default does), and that `.env.example` has **no real values**.

```bash
git ls-files | grep -E '^\.env$' && echo "DANGER: .env tracked" || echo "OK"
```

---

## 3. Database

### 3.1 Migration `create_tickets_table`

```php
Schema::create('tickets', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->string('title', 255);
    $table->text('description');
    $table->string('priority');                    // Low|Medium|High|Urgent
    $table->string('status')->default('Open');     // Open|In Progress|Resolved|Closed
    $table->string('category');                    // Hardware|Software|Network|Account|Other
    $table->timestamps();

    $table->index(['user_id', 'created_at']);
});
```

### 3.2 Constants (single source of truth)

Put allowed values on the model so Form Requests and the frontend share them.

```php
// app/Models/Ticket.php
class Ticket extends Model
{
    use HasFactory;

    public const PRIORITIES = ['Low', 'Medium', 'High', 'Urgent'];
    public const STATUSES   = ['Open', 'In Progress', 'Resolved', 'Closed'];
    public const CATEGORIES = ['Hardware', 'Software', 'Network', 'Account', 'Other'];

    protected $fillable = ['title', 'description', 'priority', 'status', 'category'];
    // user_id intentionally NOT fillable; set via relationship

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
```

Add to `User`:

```php
public function tickets()
{
    return $this->hasMany(Ticket::class);
}
```

### 3.3 Seeder (demo account + sample tickets)

```php
// database/seeders/DatabaseSeeder.php
$demo = User::firstOrCreate(
    ['email' => 'demo@helpdesk.test'],
    ['name' => 'Demo User', 'password' => Hash::make('Demo@12345')]
);

if ($demo->tickets()->count() === 0) {
    Ticket::factory()->count(15)->for($demo)->create();
}
```

> Use `firstOrCreate` so re-running the seeder on redeploy does not duplicate data. Document the demo credentials in the README.

---

## 4. Validation (Form Requests)

```bash
php artisan make:request StoreTicketRequest
php artisan make:request UpdateTicketRequest
```

```php
// app/Http/Requests/StoreTicketRequest.php
public function authorize(): bool
{
    return true; // auth middleware already guards; ownership is for the Policy
}

public function rules(): array
{
    return [
        'title'       => ['required', 'string', 'min:5', 'max:255'],
        'description' => ['required', 'string', 'min:10'],
        'priority'    => ['required', Rule::in(Ticket::PRIORITIES)],
        'status'      => ['required', Rule::in(Ticket::STATUSES)],
        'category'    => ['required', Rule::in(Ticket::CATEGORIES)],
    ];
}
```

`UpdateTicketRequest` uses the same rules. Never accept `user_id` from the request.

---

## 5. Authorization (Policy)

```bash
php artisan make:policy TicketPolicy --model=Ticket
```

```php
class TicketPolicy
{
    public function view(User $user, Ticket $ticket): bool   { return $user->id === $ticket->user_id; }
    public function update(User $user, Ticket $ticket): bool { return $user->id === $ticket->user_id; }
    public function delete(User $user, Ticket $ticket): bool { return $user->id === $ticket->user_id; }
}
```

Laravel 11+ auto-discovers policies by naming convention (`Ticket` → `TicketPolicy`). If it is not discovered, register it in `AppServiceProvider::boot()` with `Gate::policy(Ticket::class, TicketPolicy::class)`.

A failed `authorize()` throws `AuthorizationException` → **HTTP 403**.

---

## 6. Routes

```php
// routes/web.php
Route::get('/', fn () => redirect()->route('dashboard'));

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::resource('tickets', TicketController::class);
});

require __DIR__.'/auth.php';
```

> If you do not implement email verification, remove `verified` (Breeze's default `verified` middleware would otherwise block unverified demo users).

| Verb | URI | Name | Action |
|---|---|---|---|
| GET | /tickets | tickets.index | list (paginated) |
| GET | /tickets/create | tickets.create | form |
| POST | /tickets | tickets.store | store |
| GET | /tickets/{ticket} | tickets.show | details |
| GET | /tickets/{ticket}/edit | tickets.edit | edit form |
| PUT/PATCH | /tickets/{ticket} | tickets.update | update |
| DELETE | /tickets/{ticket} | tickets.destroy | delete |

---

## 7. Controller

```php
class TicketController extends Controller
{
    public function index(Request $request)
    {
        $tickets = $request->user()->tickets()
            ->when($request->status,   fn ($q, $v) => $q->where('status', $v))
            ->when($request->priority, fn ($q, $v) => $q->where('priority', $v))
            ->when($request->category, fn ($q, $v) => $q->where('category', $v))
            ->when($request->search,   fn ($q, $v) => $q->where('title', 'like', "%{$v}%"))
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Tickets/Index', [
            'tickets' => $tickets,
            'filters' => $request->only('status', 'priority', 'category', 'search'),
            'options' => $this->options(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Tickets/Create', ['options' => $this->options()]);
    }

    public function store(StoreTicketRequest $request)
    {
        $request->user()->tickets()->create($request->validated()); // user_id set from auth

        return redirect()->route('tickets.index')->with('success', 'Ticket created.');
    }

    public function show(Ticket $ticket)
    {
        $this->authorize('view', $ticket);
        return Inertia::render('Tickets/Show', ['ticket' => $ticket]);
    }

    public function edit(Ticket $ticket)
    {
        $this->authorize('update', $ticket);
        return Inertia::render('Tickets/Edit', [
            'ticket'  => $ticket,
            'options' => $this->options(),
        ]);
    }

    public function update(UpdateTicketRequest $request, Ticket $ticket)
    {
        $this->authorize('update', $ticket);
        $ticket->update($request->validated());

        return redirect()->route('tickets.show', $ticket)->with('success', 'Ticket updated.');
    }

    public function destroy(Ticket $ticket)
    {
        $this->authorize('delete', $ticket);
        $ticket->delete();

        return redirect()->route('tickets.index')->with('success', 'Ticket deleted.');
    }

    private function options(): array
    {
        return [
            'priorities' => Ticket::PRIORITIES,
            'statuses'   => Ticket::STATUSES,
            'categories' => Ticket::CATEGORIES,
        ];
    }
}
```

> In Laravel 11+, the base `Controller` no longer includes `AuthorizesRequests`. Add `use Illuminate\Foundation\Auth\Access\AuthorizesRequests;` to the base controller (or the `TicketController`), otherwise `$this->authorize()` is undefined.

### Dashboard

```php
class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $counts = $request->user()->tickets()
            ->selectRaw('status, COUNT(*) as total')
            ->groupBy('status')->pluck('total', 'status');

        return Inertia::render('Dashboard', [
            'counts' => $counts,
            'recent' => $request->user()->tickets()->latest()->limit(5)->get(),
        ]);
    }
}
```

---

## 8. Inertia Shared Data (flash + auth)

```php
// app/Http/Middleware/HandleInertiaRequests.php
public function share(Request $request): array
{
    return array_merge(parent::share($request), [
        'auth' => ['user' => $request->user()?->only('id', 'name', 'email')],
        'flash' => [
            'success' => fn () => $request->session()->get('success'),
            'error'   => fn () => $request->session()->get('error'),
        ],
    ]);
}
```

---

## 9. Frontend Structure

```
resources/js/
├── Layouts/
│   └── AuthenticatedLayout.jsx      # nav bar + <FlashMessage />
├── Components/
│   ├── FlashMessage.jsx
│   ├── PriorityBadge.jsx
│   ├── StatusBadge.jsx
│   ├── TicketForm.jsx               # shared by Create + Edit
│   ├── EmptyState.jsx
│   ├── Pagination.jsx
│   └── ConfirmDeleteModal.jsx
└── Pages/
    ├── Dashboard.jsx
    ├── Tickets/
    │   ├── Index.jsx
    │   ├── Create.jsx
    │   ├── Edit.jsx
    │   └── Show.jsx
    └── Auth/ (Breeze defaults)
```

### 9.1 Navigation bar (AuthenticatedLayout)
- Left: app name, **Dashboard**, **Tickets** (use Inertia `<Link>`)
- Right: **New Ticket** button (`route('tickets.create')`), user's name, **Logout** (`<Link method="post" as="button" href={route('logout')}>`)
- Collapses to a hamburger menu on small screens (Breeze already provides this)

### 9.2 FlashMessage
- Reads `usePage().props.flash`
- Green banner for `success`, red for `error`
- Auto-dismiss after ~4 s with `useEffect` + `setTimeout`, plus a manual close (×) button
- Re-trigger on each new flash (key on message text or use a timestamp)

### 9.3 TicketForm (shared)

```jsx
const { data, setData, post, put, processing, errors } = useForm({
  title: ticket?.title ?? '',
  description: ticket?.description ?? '',
  priority: ticket?.priority ?? 'Medium',
  status: ticket?.status ?? 'Open',
  category: ticket?.category ?? '',
});

const submit = (e) => {
  e.preventDefault();
  ticket ? put(route('tickets.update', ticket.id)) : post(route('tickets.store'));
};
```

Requirements:
- Inline `errors.field` text (red) under each input
- `<button type="submit" disabled={processing}>` with "Saving…" label while processing
- Input retained after a failed submit (Inertia's default behavior with `useForm`)
- Selects are populated from `options` props, not hard-coded duplicates
- Never use `dangerouslySetInnerHTML`

### 9.4 Tickets/Index
- Filter bar (optional): status, priority, category, search; use `router.get(route('tickets.index'), filters, { preserveState: true, replace: true })`
- **Desktop (`md:` and up):** `<table>` with Title, Category, Priority, Status, Created, Actions
- **Mobile (below `md`):** stacked cards: `hidden md:table` for the table and `md:hidden` for the card list
- Actions: View, Edit, Delete (opens `ConfirmDeleteModal`, then `router.delete(route('tickets.destroy', id))`)
- Pagination via `tickets.links` rendered with Inertia `<Link>`
- Empty state when `tickets.data.length === 0`: friendly message + "Create your first ticket" button

### 9.5 Tickets/Show
- Displays all fields, badges, timestamps
- Buttons: Back, Edit, Delete (with confirm)

### 9.6 Badge colors (Tailwind)

| Priority | Classes |
|---|---|
| Low | `bg-gray-100 text-gray-700` |
| Medium | `bg-blue-100 text-blue-700` |
| High | `bg-orange-100 text-orange-700` |
| Urgent | `bg-red-100 text-red-700` |

| Status | Classes |
|---|---|
| Open | `bg-green-100 text-green-700` |
| In Progress | `bg-yellow-100 text-yellow-800` |
| Resolved | `bg-indigo-100 text-indigo-700` |
| Closed | `bg-gray-200 text-gray-600` |

> Use full static class strings in a lookup object. Tailwind cannot detect dynamically concatenated class names.

### 9.7 Delete confirmation
Either a `window.confirm('Delete this ticket? This cannot be undone.')` or (preferred) a Tailwind modal component. Only call `router.delete` after the user confirms.

---

## 10. Security Checklist

| Control | Implementation |
|---|---|
| Password hashing | Breeze default (`Hash` / `hashed` cast) |
| Route protection | `auth` middleware on all ticket routes |
| Ownership | `TicketPolicy` + `$this->authorize()` in show/edit/update/destroy |
| Mass assignment | `$fillable` on `Ticket`; `user_id` never fillable |
| `user_id` | `$request->user()->tickets()->create(...)` |
| Validation | `StoreTicketRequest`, `UpdateTicketRequest`, `Rule::in()` |
| No `$request->all()` | Use `$request->validated()` |
| CSRF | Enabled by default (Inertia/Axios send the XSRF token automatically) |
| XSS | React escapes by default; no `dangerouslySetInnerHTML` |
| Secrets | Env vars only; `.env` in `.gitignore`; `.env.example` sanitized |
| Production flags | `APP_ENV=production`, `APP_DEBUG=false` |
| Query scoping | Index uses `$request->user()->tickets()` (never `Ticket::all()`) |

### `.env.example` (safe to commit)

```dotenv
APP_NAME=HelpDesk
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=helpdesk
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
```

---

## 11. Deployment (Railway)

### 11.1 Services
1. Create a Railway project from the GitHub repo (app service).
2. Add the **MySQL** database service to the same project.

### 11.2 Environment variables (app service)

```dotenv
APP_NAME=HelpDesk
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:...                 # php artisan key:generate --show
APP_URL=https://<your-app>.up.railway.app

DB_CONNECTION=mysql
DB_HOST=${{MySQL.MYSQLHOST}}
DB_PORT=${{MySQL.MYSQLPORT}}
DB_DATABASE=${{MySQL.MYSQLDATABASE}}
DB_USERNAME=${{MySQL.MYSQLUSER}}
DB_PASSWORD=${{MySQL.MYSQLPASSWORD}}

SESSION_DRIVER=database
LOG_CHANNEL=stderr
```

> The reference names (`MySQL`, `MYSQLHOST`, etc.) depend on how Railway names your service. Check the MySQL service's Variables tab and adjust. Set these in Railway's dashboard, never in the repository.

### 11.3 HTTPS and mixed content
Railway terminates TLS at its proxy, so Laravel must trust it:

```php
// bootstrap/app.php
->withMiddleware(function (Middleware $middleware) {
    $middleware->trustProxies(at: '*');
    // ...
})
```

```php
// app/Providers/AppServiceProvider.php
use Illuminate\Support\Facades\URL;

public function boot(): void
{
    if (app()->environment('production')) {
        URL::forceScheme('https');
    }
}
```

### 11.4 Build and start

- **Build:** `composer install --no-dev --optimize-autoloader && npm ci && npm run build`
- **Release / pre-start:** `php artisan migrate --force`
- **Start:** `php artisan serve --host=0.0.0.0 --port=$PORT`
  (Nixpacks/Railpack with a PHP provider can serve through Caddy/nginx automatically; either approach is acceptable if the site is live over HTTPS.)

Example start command chaining migration:

```bash
php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=$PORT
```

### 11.5 Post-deploy verification
- [ ] Site loads over `https://` with no mixed-content warnings (check DevTools console)
- [ ] CSS/JS assets load (Vite `build` manifest present)
- [ ] Register a new user; create, edit, delete a ticket
- [ ] Trigger a redeploy; data still present (proves MySQL, not container SQLite)
- [ ] Visit `/tickets/<another-user's-id>` → **403**
- [ ] Visit `/tickets` logged out → redirected to `/login`
- [ ] A forced error does not reveal a stack trace (debug off)

---

## 12. Test Plan

### Manual test matrix

| # | Scenario | Expected |
|---|---|---|
| 1 | Register with valid data | Account created, lands on Dashboard |
| 2 | Register with duplicate email | Inline error under email |
| 3 | Login wrong password | Inline error |
| 4 | Guest opens `/tickets` | Redirect to `/login` |
| 5 | Create ticket, valid | Redirect to index; "Ticket created." |
| 6 | Create ticket, title 3 chars | Inline "title must be at least 5 characters"; inputs preserved |
| 7 | Create ticket, description 5 chars | Inline error |
| 8 | Tamper priority value in devtools | 422 validation error |
| 9 | Submit while processing | Button disabled |
| 10 | Index with > 10 tickets | Pagination controls, 10 per page |
| 11 | No tickets | Empty state shown |
| 12 | Edit form | Pre-filled; update shows "Ticket updated." |
| 13 | Delete | Confirmation first; "Ticket deleted." |
| 14 | User B opens User A's `/tickets/{id}` | 403 |
| 15 | User B sends DELETE to User A's ticket | 403, ticket intact |
| 16 | POST with `user_id` in body | Ignored; owner is the authenticated user |
| 17 | Phone width (360px) | Cards instead of table; no horizontal scroll |

### Optional automated tests (Pest/PHPUnit)

```php
test('user cannot view another users ticket', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();
    $ticket = Ticket::factory()->for($owner)->create();

    $this->actingAs($other)->get(route('tickets.show', $ticket))->assertForbidden();
});

test('guest is redirected to login', function () {
    $this->get(route('tickets.index'))->assertRedirect('/login');
});

test('user_id cannot be mass assigned from request', function () {
    $user = User::factory()->create();
    $other = User::factory()->create();

    $this->actingAs($user)->post(route('tickets.store'), [
        'title' => 'Printer broken', 'description' => 'Paper jam on floor 2',
        'priority' => 'High', 'status' => 'Open', 'category' => 'Hardware',
        'user_id' => $other->id,
    ]);

    $this->assertDatabaseHas('tickets', ['title' => 'Printer broken', 'user_id' => $user->id]);
});
```

---

## 13. Repository Conventions

### Commit plan (regular, meaningful commits)
```
chore: scaffold Laravel + Breeze (React)
feat: add tickets migration, model, factory
feat: add Store/Update form requests and TicketPolicy
feat: add TicketController and resource routes
feat: add ticket index and create pages
feat: add edit, show and delete with confirmation
feat: add flash messages and shared Inertia props
style: add badges, empty state and responsive cards
feat: add dashboard counters and filters
chore: production config (trust proxies, force https)
docs: add README with demo credentials and live URL
```

### README must include
- Live URL
- Demo credentials
- Local setup steps
- Stack summary

### Never commit
`.env`, `APP_KEY` values, DB passwords, `storage/*.key`, `vendor/`, `node_modules/`.

---

## 14. Recommended Build Order

1. Scaffold Laravel + Breeze (React); verify register/login/logout locally
2. Migration, model (`$fillable`, constants), factory, seeder
3. Form Requests and `TicketPolicy`
4. `TicketController` + `Route::resource` in `auth` group
5. Shared props (`flash`, `auth`) in `HandleInertiaRequests`
6. Layout (nav) and `FlashMessage`
7. `TicketForm` + Create/Edit pages
8. Index (table + mobile cards + pagination + empty state), Show, delete modal
9. Badges, Dashboard, optional filters
10. Deploy to Railway **early** (by the 1h mark), then iterate
11. Final checklist from PRD §10 and §11.5 on the live URL

---

## 15. Defense Prep: Be Ready to Explain

- Why `$request->user()->tickets()->create()` instead of passing `user_id`
- How the Policy is invoked and why it returns 403 rather than 404
- What `$fillable` protects against
- What `Rule::in()` does and why it matters if the client sends a tampered value
- How Inertia avoids full page reloads (XHR visits + `X-Inertia` header)
- What `useForm` gives you (`data`, `errors`, `processing`, preserved inputs)
- How flash data travels: `with('success')` → session → `HandleInertiaRequests::share` → `usePage().props.flash`
- Why `trustProxies` and `forceScheme('https')` are needed on Railway
- Why MySQL on Railway persists across redeploys while container SQLite does not
