# UI/UX Design Document
## HelpDesk Ticket Management System

Companion to `PRD.md` and `SPEC.md`. This document defines how the app looks, reads, and behaves. Every decision maps to a Tailwind class or a React component so it can be built inside the 2-hour exam window.

---

## 1. Design brief

| | |
|---|---|
| **Subject** | A ticket tracker for a small IT services office that currently uses a shared spreadsheet |
| **Audience** | Office staff who report issues; they are not technical, they are busy, and they often check on a phone |
| **Primary job** | Let a person report a problem in under a minute, then see where it stands without asking anyone |
| **Rubric focus** | Tailwind only, responsive (cards on phone, table on desktop), persistent nav, flash messages, inline errors, disabled submit while processing, color-coded badges, friendly empty state |

### 1.1 Design concept: the service ticket

The spreadsheet failed because rows had no identity or owner. The design fixes that by treating every ticket as a physical **service ticket**, like a repair-shop claim tag or a deli queue slip.

- Each ticket has a **stub**: its number (`#0042`) set in tabular figures, separated from the content by a dashed "tear line".
- Each ticket carries a **priority edge**, a colored stripe along its left side, so a list scans like a rack of tags.
- Everything else stays quiet: cool neutral surfaces, thin borders, almost no shadow.

**The one memorable element is the ticket stub and priority edge.** Everything around it is deliberately plain so that element does the work.

### 1.2 Design principles

1. **Status at a glance.** Priority and status are readable without opening a ticket, and never depend on color alone.
2. **Say what happened.** Every action ends in a plain-language message. Errors say what is wrong and how to fix it.
3. **Mine only.** The interface only ever shows the user's own tickets, so it never needs to explain ownership. A 403 gets its own clear page.
4. **One-handed on a phone.** Targets are at least 44px, forms are single column, and "New ticket" is always one tap away.
5. **Stay in the page.** All movement is Inertia navigation; the UI should never flash white.

### 1.3 Deliberate departures from defaults

Common generated-UI looks were rejected on purpose:

| Default avoided | What we do instead |
|---|---|
| Cream background with serif and terracotta accent | Cool paper-grey surfaces, deep ink navy, harbor blue |
| Dark mode with a single neon accent | Light, daytime office tool (dark mode is out of scope) |
| Identical rounded cards with identical soft shadows | Varied radii by role; borders instead of shadows; the ticket stub is the only "card" with a distinct shape |
| All-caps tracked eyebrow labels above headings | Sentence-case headings; no eyebrows |
| Colored pills for everything | Status = dotted pill; priority = signal bars plus a left edge stripe |
| Arrows appended to buttons | Plain verb labels |

---

## 2. Information architecture

### 2.1 Sitemap

```
Guest
├── /login               Log in
├── /register            Create account
└── (any /tickets URL)   redirects to /login

Signed in
├── /dashboard           Your queue (counts + recent tickets)
├── /tickets             All my tickets (paginated, optional filters)
│   ├── /tickets/create  New ticket
│   ├── /tickets/{id}    Ticket details
│   └── /tickets/{id}/edit  Edit ticket
├── /profile             Breeze profile (restyle only, low priority)
└── Error page           403, 404, 419, 500, 503 (Inertia-rendered)
```

### 2.2 Navigation model

- A **single persistent top bar** on every signed-in page.
- Desktop: `[HelpDesk]  Dashboard  Tickets          [New ticket]  Demo User  Log out`
- Phone: `[HelpDesk]                       [+] [menu]`; the menu drawer holds Dashboard, Tickets, the user's name, and Log out. The `[+]` icon button for New ticket stays outside the drawer so creating a ticket is always one tap.
- The active section is shown with a sky-blue underline (desktop) or a tinted row (drawer), plus `aria-current="page"`.
- Breadcrumb-style "Back to tickets" link on Show, Create, and Edit pages.

---

## 3. Key user flows

### 3.1 Report a problem (main flow)
```
Tickets or Dashboard → [New ticket] → fill form → [Create ticket]
   ├─ valid   → Tickets list, toast "Ticket created."
   └─ invalid → stay on form, errors under fields, values kept, button re-enabled
```

### 3.2 Update progress
```
Tickets → open row/card → [Edit ticket] → change Status → [Update ticket]
   → Ticket details page, toast "Ticket updated."
```
Shortcut for later: a status select directly on the details page. Not required; skip in the exam.

### 3.3 Remove a ticket
```
Tickets row/card or Details → [Delete] → modal "Delete this ticket?"
   ├─ [Keep ticket]   → modal closes, nothing changes
   └─ [Delete ticket] → Tickets list, toast "Ticket deleted."
```

### 3.4 Guest hits a protected URL
```
/tickets (logged out) → 302 /login → after login, land on Dashboard
```

### 3.5 Open someone else's ticket by editing the URL
```
/tickets/{other id} → server returns 403 → friendly error page
   "You can't open this ticket" + [Back to my tickets]
```

---

## 4. Visual design system

### 4.1 Color

Core palette (named, with hex):

| Token | Name | Hex | Use |
|---|---|---|---|
| `ink` | Switchboard ink | `#16263A` | Nav bar, headings, primary text |
| `paper` | Counter paper | `#F5F7F9` | App background |
| `harbor` | Harbor blue | `#1B6FA8` | Primary buttons, links, focus ring |
| `harbor-dark` | Harbor deep | `#14537F` | Primary button hover/active |
| `line` | Fine line | `#D8DEE6` | Borders and dividers |
| `surface` | Surface | `#FFFFFF` | Cards, table, forms |

Supporting neutrals use Tailwind slate: `slate-600` (`#475569`) for secondary text, `slate-500` (`#64748B`) for placeholders and hints.

Contrast checks (WCAG AA needs 4.5:1 for body text):

| Pair | Ratio (approx.) | Result |
|---|---|---|
| `ink` on `paper` | > 12:1 | Pass |
| `harbor` on white | 5.4:1 | Pass |
| White on `harbor` (button text) | 5.4:1 | Pass |
| `slate-600` on white | 7.5:1 | Pass |
| `slate-500` on white | 4.8:1 | Pass (use for placeholders, not slate-400) |
| `red-700` on white | 6.5:1 | Pass |

#### Status (dotted pill, soft fill)

| Status | Pill classes | Dot |
|---|---|---|
| Open | `bg-sky-100 text-sky-900` | `bg-sky-500` |
| In Progress | `bg-amber-100 text-amber-900` | `bg-amber-500` |
| Resolved | `bg-emerald-100 text-emerald-900` | `bg-emerald-500` |
| Closed | `bg-slate-200 text-slate-700` | `bg-slate-500` |

#### Priority (signal bars + text, plus edge stripe)

| Priority | Bars filled | Stripe / bar color | Text |
|---|---|---|---|
| Low | 1 of 4 | `slate-400` | `text-slate-700` |
| Medium | 2 of 4 | `indigo-500` | `text-indigo-800` |
| High | 3 of 4 | `orange-500` | `text-orange-800` |
| Urgent | 4 of 4 | `red-600` | `text-red-800 font-semibold` |

Why two different treatments: status and priority both use colors, and a user could confuse them. Different shapes (dotted pill vs. rising bars) keep them apart, and the bar count plus the written word mean color is never the only signal (color-blind safe).

#### Feedback colors
- Success: `emerald-600` icon, `emerald-50` background, `emerald-200` border, `emerald-900` text
- Error: `red-600` icon, `red-50` background, `red-200` border, `red-900` text
- Field error text: `text-red-700`; invalid input border: `border-red-600`

### 4.2 Typography

| Role | Typeface | Why |
|---|---|---|
| Display (page titles, ticket titles, stat numbers) | **Bricolage Grotesque** | A grotesque with some character; reads as designed, not default |
| UI and body | **Public Sans** | Neutral, highly legible at small sizes, built for institutional and utility interfaces |

Load in `resources/views/app.blade.php` (replace Breeze's Figtree link):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,700&family=Public+Sans:wght@400;500;600&display=swap" rel="stylesheet">
```

Always keep real fallbacks: `'Public Sans', ui-sans-serif, system-ui, sans-serif`.

Type scale (Tailwind classes):

| Use | Class | Size / line height | Weight | Face |
|---|---|---|---|---|
| Page title | `text-2xl sm:text-3xl` | 24 or 30 / 1.2 | 700 | Display |
| Section title | `text-lg` | 18 / 1.4 | 600 | Display |
| Ticket title on details | `text-2xl` | 24 / 1.25 | 700 | Display |
| Body | `text-base` | 16 / 1.5 | 400 | Body |
| Table and card text | `text-sm` | 14 / 1.45 | 400, 500 | Body |
| Hint, timestamp | `text-xs`, `text-sm` | 12 to 14 | 400 | Body |
| Ticket number | `text-sm tabular-nums font-semibold` | 14 | 600 | Display |

Rules:
- Sentence case everywhere. No all-caps labels.
- Description text is capped at `max-w-prose` (about 65 characters per line).
- Form inputs are `text-base` on phones to stop iOS Safari zooming on focus.
- Headings are left-aligned. Numbers in tables are right-aligned only if numeric; ticket numbers stay left.

### 4.3 Spacing and layout

- Base unit: 4px (Tailwind default scale).
- Page container: `mx-auto max-w-6xl px-4 sm:px-6 lg:px-8`; page vertical padding `py-6 sm:py-8`.
- Form container: `max-w-2xl`.
- Section gap: `space-y-6`. Field gap: `space-y-5`. Label to input: `mt-1.5`.
- Card padding: `p-4 sm:p-5`.

### 4.4 Shape and elevation

Radii follow role, not one value for everything:

| Element | Radius |
|---|---|
| Inputs, buttons | `rounded-md` |
| Panels (table wrapper, form panel) | `rounded-lg` |
| Ticket stub card | `rounded-lg` with a square-cornered left edge stripe (`border-l-4`) |
| Status pill | `rounded-full` |
| Modal | `rounded-xl` |

Elevation: panels use `border border-line` and **no shadow**. Only floating things get a shadow: toast (`shadow-lg`), modal (`shadow-xl`), mobile drawer.

### 4.5 Iconography
- Use inline SVG (or `@heroicons/react` if installed quickly). Size `h-5 w-5`, `stroke-2`, inherit `currentColor`.
- Icons needed: plus, menu, close, check-circle, exclamation-circle, eye, pencil, trash, chevron-left, chevron-right, inbox (empty state).
- Icon-only buttons always get `aria-label`.

### 4.6 Motion
- Interactions only; no entrance animations on page load.
- Buttons and links: `transition-colors duration-150`.
- Toast: fade in over 150 ms; fade out on dismiss.
- Inertia progress bar in harbor blue (`progress: { color: '#1B6FA8' }` in `app.jsx`).
- Respect reduced motion: use `motion-reduce:transition-none`.

---

## 5. Tailwind configuration

### 5.1 Tailwind v3 (Breeze default)

```js
// tailwind.config.js
import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

export default {
  content: [
    './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
    './storage/framework/views/*.php',
    './resources/views/**/*.blade.php',
    './resources/js/**/*.jsx',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#16263A',
        paper: '#F5F7F9',
        harbor: { DEFAULT: '#1B6FA8', dark: '#14537F' },
        line: '#D8DEE6',
      },
      fontFamily: {
        display: ['"Bricolage Grotesque"', ...defaultTheme.fontFamily.sans],
        sans: ['"Public Sans"', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [forms],
};
```

### 5.2 Tailwind v4 (if your starter kit uses it)

```css
/* resources/css/app.css */
@import "tailwindcss";

@theme {
  --color-ink: #16263A;
  --color-paper: #F5F7F9;
  --color-harbor: #1B6FA8;
  --color-harbor-dark: #14537F;
  --color-line: #D8DEE6;
  --font-display: "Bricolage Grotesque", ui-sans-serif, system-ui, sans-serif;
  --font-sans: "Public Sans", ui-sans-serif, system-ui, sans-serif;
}
```

Set `<body class="bg-paper font-sans text-ink antialiased">`.

> Tailwind only detects full class names in source. Keep badge and priority classes in lookup objects as complete strings; never build them with template strings like `` `bg-${color}-100` ``.

---

## 6. Layout and wireframes

### 6.1 App shell (signed in)

```
Desktop (>= 768px)
┌───────────────────────────────────────────────────────────────────┐
│ HelpDesk   Dashboard  Tickets             [New ticket] Demo  Log out│  ink bar, sticky
├───────────────────────────────────────────────────────────────────┤
│  (toast appears top-right over content)                           │
│  max-w-6xl content                                                │
└───────────────────────────────────────────────────────────────────┘

Phone (< 768px)
┌───────────────────────────┐
│ HelpDesk          [+] [≡] │  ink bar, sticky
├───────────────────────────┤
│  toast: full width        │
│  content, px-4            │
└───────────────────────────┘
```

### 6.2 Dashboard

```
Your queue                                          [New ticket]

┌ Open ──────┐ ┌ In Progress ┐ ┌ Resolved ──┐ ┌ Closed ────┐
│ 4          │ │ 2           │ │ 7          │ │ 3          │   each links to /tickets?status=...
└────────────┘ └─────────────┘ └────────────┘ └────────────┘

Recent tickets                                    View all tickets
┌────────────────────────────────────────────────────────────┐
│▌#0016 | Printer jams on floor 2     Hardware   ● Open      │
│▌#0015 | VPN drops every hour        Network    ● In Progress│
│  ...5 rows                                                 │
└────────────────────────────────────────────────────────────┘
```
Phone: the four counters become a 2 x 2 grid (`grid grid-cols-2 lg:grid-cols-4 gap-3`). Counters link to the filtered list only if you build filters; otherwise they are static.

### 6.3 Tickets index (desktop table)

```
My tickets                                          [New ticket]
(optional) [Status v] [Priority v] [Category v] [Search title...]  Clear filters

┌─────┬──────────────────────────┬──────────┬────────────┬─────────────┬───────────┬──────────────┐
│ No. │ Title                    │ Category │ Priority   │ Status      │ Created   │              │
├─────┼──────────────────────────┼──────────┼────────────┼─────────────┼───────────┼──────────────┤
│▌0016│ Printer jams on floor 2  │ Hardware │ ▂▄▆█ Urgent│ ● Open      │ Oct 12    │ View Edit Del│
│▌0015│ VPN drops every hour     │ Network  │ ▂▄▆  High  │ ● In Progress│ Oct 11   │ View Edit Del│
└─────┴──────────────────────────┴──────────┴────────────┴─────────────┴───────────┴──────────────┘
Showing 1 to 10 of 23                               [Previous] 1 2 3 [Next]
```
The first cell carries the priority stripe (`border-l-4` in the priority color).

### 6.4 Tickets index (phone: stacked ticket stubs)

```
┌────────────────────────────────┐
│▌  #0016  ┆ Printer jams on     │
│▌         ┆ floor 2             │
│▌  ────────┆────────────────────│   dashed tear line between stub and body
│▌  Hardware · ▂▄▆█ Urgent       │
│▌  ● Open              Oct 12   │
│▌  [View]  [Edit]  [Delete]     │
└────────────────────────────────┘
```
Implementation: wrapper `border border-line bg-white rounded-lg border-l-4`, stub column with `border-r border-dashed border-line`. Use `hidden md:block` for the table and `md:hidden` for the card list. Never allow horizontal scroll on the page body.

### 6.5 Empty state

```
┌────────────────────────────────────────────┐
│                 [inbox icon]               │
│              No tickets yet                │
│  When you report an issue, it shows up     │
│  here so you can follow it to resolution.  │
│            [Create ticket]                 │
└────────────────────────────────────────────┘
```
Filtered-empty variant: "No tickets match these filters" with a **Clear filters** button.

### 6.6 Create / edit form

```
< Back to tickets
Create ticket

┌ panel (max-w-2xl) ─────────────────────────────────┐
│ Title                                              │
│ [______________________________________]           │
│ Give it a short name, at least 5 characters.       │
│                                                    │
│ Description                                        │
│ [______________________________________]           │
│ [______________________________________]  (5 rows) │
│ What happened and what you were doing. 10+ chars.  │
│                                                    │
│ Category        Priority         Status            │   3 columns on sm+, stacked on phone
│ [Select v]      [Medium v]       [Open v]          │
│                                                    │
│ [Create ticket]   Cancel                           │
└────────────────────────────────────────────────────┘
```
Edit form is identical, title "Edit ticket", submit "Update ticket", fields pre-filled.

### 6.7 Ticket details

```
< Back to tickets

#0016
Printer jams on floor 2                 [Edit ticket] [Delete]
● Open    ▂▄▆█ Urgent    Hardware
Opened Oct 12, 2026, 9:14 AM · Last updated Oct 12, 2026, 10:02 AM

┌ Description ───────────────────────────────┐
│ The shared printer on floor 2 jams on...   │   max-w-prose, whitespace-pre-line
└────────────────────────────────────────────┘
```
Use `whitespace-pre-line` so line breaks display, and render text as a normal React child (auto-escaped). Never `dangerouslySetInnerHTML`.

### 6.8 Auth pages (login, register)

```
        HelpDesk
        Track your support tickets

   ┌ panel (max-w-md) ────────────────┐
   │ Email                            │
   │ [____________________________]   │
   │ Password                         │
   │ [____________________________]   │
   │ [ ] Remember me                  │
   │ [Log in]                         │
   │ No account? Create one           │
   └──────────────────────────────────┘
```
Centered on `bg-paper`. Restyle the Breeze components (TextInput, PrimaryButton, InputLabel, InputError) instead of rewriting pages.

### 6.9 Error page (403, 404, 500)

```
              403
     You can't open this ticket
 It belongs to another account. You can only
 view and change tickets you created.
         [Back to my tickets]
```
Copy by status:

| Status | Title | Body |
|---|---|---|
| 403 | You can't open this ticket | It belongs to another account. You can only view and change your own tickets. |
| 404 | We can't find that page | The link may be old, or the ticket was deleted. |
| 419 | Your session expired | Refresh the page and try again. |
| 500 / 503 | Something went wrong on our end | Try again in a moment. If it keeps happening, tell your IT contact. |

Render it through Inertia while keeping the real status code, so the 403 test still returns 403:

```php
// bootstrap/app.php
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

->withExceptions(function (Exceptions $exceptions) {
    $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
        if (! app()->environment(['local', 'testing'])
            && in_array($response->getStatusCode(), [403, 404, 419, 500, 503])) {
            return Inertia::render('Error', ['status' => $response->getStatusCode()])
                ->toResponse($request)
                ->setStatusCode($response->getStatusCode());
        }
        return $response;
    });
})
```
This is a polish item. If time runs short, Laravel's default 403 page still satisfies the requirement.

---

## 7. Component specifications

### 7.1 Buttons

| Variant | Classes | Use |
|---|---|---|
| Primary | `inline-flex items-center justify-center gap-2 rounded-md bg-harbor px-4 min-h-11 text-sm font-medium text-white hover:bg-harbor-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-harbor focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed` | Create ticket, Update ticket, Log in |
| On-dark (nav) | `bg-white text-ink hover:bg-slate-100 ...` | New ticket in the nav |
| Secondary | `border border-line bg-white text-ink hover:bg-slate-50 ...` | Edit ticket, Cancel, Keep ticket |
| Danger | `bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-600 ...` | Delete ticket (confirm only) |
| Link-style | `text-harbor underline-offset-2 hover:underline` | Row actions on desktop |

Rules:
- Touch target `min-h-11` (44px) on phone; `sm:min-h-10` allowed on desktop.
- Submit button: `disabled={processing}`, label switches to "Saving…" while processing.
- Danger styling is only used for the final confirm, not for the first "Delete" trigger (which is secondary with a red text, `text-red-700`).

### 7.2 Form fields

Structure (label above, hint below, error below hint):

```jsx
<div>
  <label htmlFor="title" className="block text-sm font-medium text-ink">Title</label>
  <input
    id="title"
    value={data.title}
    onChange={e => setData('title', e.target.value)}
    aria-invalid={!!errors.title}
    aria-describedby={errors.title ? 'title-error' : 'title-hint'}
    className={`mt-1.5 block w-full rounded-md bg-white text-base sm:text-sm min-h-11 sm:min-h-10
      border ${errors.title ? 'border-red-600' : 'border-line'}
      focus:border-harbor focus:ring-2 focus:ring-harbor/30 placeholder:text-slate-500`}
  />
  <p id="title-hint" className="mt-1 text-xs text-slate-600">Short and specific, at least 5 characters.</p>
  {errors.title && <p id="title-error" className="mt-1 text-sm text-red-700">{errors.title}</p>}
</div>
```

- All fields have visible labels; placeholders are never the label.
- The error replaces nothing: keep the hint and add the error text beneath it (or swap them if space is tight).
- Textarea: `rows={5}`, same classes, `resize-y`.
- Selects: same base classes; options come from the `options` Inertia prop.
- Show a small character counter on title (`n / 255`) only if time allows.
- Focus moves to the first invalid field after a failed submit: `onError: () => firstErrorRef.current?.focus()`.

### 7.3 Status pill and priority tag

```jsx
const STATUS = {
  'Open':        { pill: 'bg-sky-100 text-sky-900',         dot: 'bg-sky-500' },
  'In Progress': { pill: 'bg-amber-100 text-amber-900',     dot: 'bg-amber-500' },
  'Resolved':    { pill: 'bg-emerald-100 text-emerald-900', dot: 'bg-emerald-500' },
  'Closed':      { pill: 'bg-slate-200 text-slate-700',     dot: 'bg-slate-500' },
};

export function StatusBadge({ status }) {
  const s = STATUS[status] ?? STATUS['Open'];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} aria-hidden="true" />
      {status}
    </span>
  );
}
```

```jsx
const PRIORITY = {
  'Low':    { bars: 1, bar: 'bg-slate-400',  text: 'text-slate-700',  stripe: 'border-l-slate-400' },
  'Medium': { bars: 2, bar: 'bg-indigo-500', text: 'text-indigo-800', stripe: 'border-l-indigo-500' },
  'High':   { bars: 3, bar: 'bg-orange-500', text: 'text-orange-800', stripe: 'border-l-orange-500' },
  'Urgent': { bars: 4, bar: 'bg-red-600',    text: 'text-red-800 font-semibold', stripe: 'border-l-red-600' },
};

export function PriorityTag({ priority }) {
  const p = PRIORITY[priority] ?? PRIORITY['Low'];
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm ${p.text}`}>
      <span className="flex items-end gap-0.5" aria-hidden="true">
        {[1, 2, 3, 4].map(i => (
          <span key={i}
            className={`w-1 rounded-sm ${i <= p.bars ? p.bar : 'bg-slate-200'}`}
            style={{ height: `${4 + i * 3}px` }} />
        ))}
      </span>
      {priority}
    </span>
  );
}
```

> The exam bans inline `style` **blocks** for styling. If you want to be strict, replace the dynamic height with fixed classes: `h-2`, `h-3`, `h-4`, `h-5` for bars 1 to 4. Do that to avoid any debate during the checking.

### 7.4 Ticket number

```jsx
export const ticketNo = (id) => `#${String(id).padStart(4, '0')}`;
```
Render with `tabular-nums font-display font-semibold`. This is display-only; the database id is unchanged.

### 7.5 Tickets table (desktop)

- Wrapper: `hidden md:block overflow-hidden rounded-lg border border-line bg-white`
- Head: `bg-slate-50 text-left text-sm font-medium text-slate-600`, normal case
- Rows: `border-t border-line hover:bg-slate-50`
- First cell: `border-l-4 ${priority stripe}`
- Title cell is an Inertia `<Link>` to the details page (`font-medium text-ink hover:text-harbor`), truncated with `max-w-xs truncate` and a `title` attribute
- Actions: View, Edit, Delete as text buttons, grouped right-aligned

### 7.6 Ticket stub card (phone)

Wrapper: `md:hidden rounded-lg border border-line border-l-4 ${stripe} bg-white`

- Left stub: ticket number, `w-20 shrink-0 border-r border-dashed border-line p-3`
- Right body: title (2-line clamp `line-clamp-2`), then category, priority, status, date
- Footer: three equal-width action buttons (`grid grid-cols-3 gap-2`) with 44px height
- The whole card title is the link; actions are separate buttons

### 7.7 Pagination

- Use Laravel's `links` array with Inertia `<Link preserveScroll>`.
- Desktop: "Showing 1 to 10 of 23" on the left; page buttons on the right.
- Phone: only Previous and Next plus "Page 2 of 3" in the middle, to avoid overflow.
- The current page uses `bg-harbor text-white`; disabled ends use `opacity-50 pointer-events-none`.
- Labels from Laravel come as HTML entities (`&laquo; Previous`); render them as plain text ("Previous", "Next") rather than injecting HTML, so `dangerouslySetInnerHTML` is never used.

### 7.8 Flash message (toast)

| Property | Spec |
|---|---|
| Source | `usePage().props.flash.success` and `.error` |
| Position | Desktop: fixed top-right below the nav (`top-20 right-6 w-96`); phone: full width under the nav (`inset-x-4 top-16`) |
| Look | Success: `bg-emerald-50 border border-emerald-200 text-emerald-900`; error: `bg-red-50 border-red-200 text-red-900`; `rounded-lg shadow-lg p-4`, icon at left |
| Behavior | Auto-dismiss at 5 s; pause while hovered; manual close button `aria-label="Dismiss message"` |
| A11y | Success: `role="status"` (polite); error: `role="alert"` (assertive) |
| Re-trigger | Use a key so the same message twice (two deletes in a row) shows again |

Messages (exact text):

| Action | Message |
|---|---|
| Create | Ticket created. |
| Update | Ticket updated. |
| Delete | Ticket deleted. |
| Unexpected failure | Something went wrong. Please try again. |

### 7.9 Delete confirmation modal

```
┌─────────────────────────────────────────┐
│ Delete this ticket?                     │
│ "Printer jams on floor 2" will be       │
│ permanently removed. This can't be      │
│ undone.                                 │
│                                         │
│              [Keep ticket] [Delete ticket]│
└─────────────────────────────────────────┘
```
- `role="dialog" aria-modal="true" aria-labelledby`
- Backdrop `bg-ink/50`; panel `rounded-xl bg-white p-6 shadow-xl max-w-md w-full`
- Initial focus on **Keep ticket** (the safe choice); Escape and backdrop click close it
- Focus trap while open; return focus to the trigger on close
- Confirm button shows "Deleting…" and is disabled while `router.delete` is processing (`onStart`/`onFinish`)
- Breeze ships a `Modal` component (Headless UI); reuse it rather than building a new one

### 7.10 Navigation bar

- `sticky top-0 z-40 bg-ink text-white`; height `h-14`
- Brand: "HelpDesk" in display face, `font-bold`
- Links: `text-sm text-slate-200 hover:text-white`; active `text-white border-b-2 border-sky-300`
- Right side (desktop): **New ticket** (on-dark button), user name (`text-sm`, truncated), **Log out** as `<Link method="post" as="button">`
- Phone: `[+]` icon button (`aria-label="New ticket"`) then hamburger; drawer slides down with user name at top
- Show the user's name exactly as the exam requires ("showing the logged-in user's name")

### 7.11 Loading and processing states

| Moment | Treatment |
|---|---|
| Page navigation | Inertia progress bar (harbor) |
| Form submit | Button disabled + "Saving…"; inputs stay editable but submit blocked |
| Delete | Confirm button disabled + "Deleting…" |
| Filter change | `preserveState`, `replace`; list dims to `opacity-60` while loading |

Skeleton screens are not needed; the progress bar is enough.

---

## 8. Content and microcopy guide

Voice: plain, direct, sentence case, active verbs. Errors never apologize and always say how to fix the problem. The same action keeps the same name from button to toast.

### 8.1 Verb consistency

| Button | Toast |
|---|---|
| Create ticket | Ticket created. |
| Update ticket | Ticket updated. |
| Delete ticket | Ticket deleted. |
| Log out | (no toast; redirect to login) |

### 8.2 Page titles and headings

| Screen | Heading | Primary action |
|---|---|---|
| Dashboard | Your queue | New ticket |
| Tickets | My tickets | New ticket |
| Create | Create ticket | Create ticket |
| Edit | Edit ticket | Update ticket |
| Details | (ticket title) | Edit ticket |
| Login | Log in | Log in |
| Register | Create your account | Create account |

Set the browser tab title with Inertia's `<Head title="..." />` on every page (for example "My tickets - HelpDesk").

### 8.3 Field labels, hints, and custom validation messages

| Field | Label | Hint |
|---|---|---|
| title | Title | Short and specific, at least 5 characters. |
| description | Description | What happened and what you were doing. At least 10 characters. |
| category | Category | Pick the closest match. |
| priority | Priority | How much it is blocking your work. |
| status | Status | Where the work stands now. |

Add friendlier messages in the Form Requests (optional polish):

```php
public function messages(): array
{
    return [
        'title.required'       => 'Enter a title for the ticket.',
        'title.min'            => 'The title needs at least 5 characters.',
        'title.max'            => 'The title can be at most 255 characters.',
        'description.required' => 'Describe the problem so it can be fixed.',
        'description.min'      => 'The description needs at least 10 characters.',
        'priority.in'          => 'Choose Low, Medium, High, or Urgent.',
        'status.in'            => 'Choose Open, In Progress, Resolved, or Closed.',
        'category.in'          => 'Choose one of the listed categories.',
        'category.required'    => 'Choose a category.',
    ];
}
```

### 8.4 Empty, error, and confirmation copy
- Empty list: "No tickets yet" / "When you report an issue, it shows up here so you can follow it to resolution." / **Create ticket**
- Filtered empty: "No tickets match these filters" / **Clear filters**
- Login failure (Laravel default is fine): "These credentials do not match our records."
- Delete modal: "Delete this ticket?" / "{title} will be permanently removed. This can't be undone." / **Keep ticket**, **Delete ticket**

### 8.5 Dates
Display as `Oct 12, 2026` in lists and `Oct 12, 2026, 9:14 AM` on details. Format once in a helper (`toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })`). Use the `<time dateTime=...>` element.

---

## 9. Responsive behavior

| Breakpoint | Width | Behavior |
|---|---|---|
| base | 360 to 639 | Single column; stub cards; hamburger + `[+]`; stacked form selects; 2 x 2 dashboard counters; simple pagination |
| `sm` | 640+ | Form selects in 3 columns; page padding grows; fuller pagination |
| `md` | 768+ | Table replaces cards; full nav links appear; actions inline |
| `lg` | 1024+ | Dashboard counters in 4 columns; content stays at `max-w-6xl` |

Rules:
- Test at **360px, 390px, 768px, 1280px**.
- No horizontal scrolling of the page body at any width. If any wide content exists, wrap it in `overflow-x-auto`.
- Include `<meta name="viewport" content="width=device-width, initial-scale=1">` (Breeze does).
- Long titles wrap on cards (`break-words`) and truncate in the table.

---

## 10. Accessibility checklist

- [ ] Text contrast meets WCAG AA (palette in section 4.1 already checked)
- [ ] Visible focus ring on every interactive element (`focus-visible:ring-2 ring-harbor ring-offset-2`)
- [ ] Every input has a `<label htmlFor>`; errors linked with `aria-describedby`; invalid fields have `aria-invalid`
- [ ] Status and priority are never conveyed by color alone (dot + text, bars + text)
- [ ] Flash messages announced (`role="status"` or `role="alert"`)
- [ ] Modal: `role="dialog"`, labelled, focus trapped, Escape closes, focus restored
- [ ] Icon-only buttons have `aria-label`
- [ ] Nav uses `<nav aria-label="Main">` and `aria-current="page"`
- [ ] Table uses real `<table>`, `<th scope="col">`; cards use headings or `<article>`
- [ ] Touch targets at least 44px on phone
- [ ] Reduced motion respected (`motion-reduce:transition-none`)
- [ ] Page `<title>` changes per page; `<html lang="en">`
- [ ] Keyboard-only run-through: register, create, edit, delete ticket

---

## 11. Security-aware UI rules

These affect design because the grader checks them.

- Render user content only as React text children. Never `dangerouslySetInnerHTML` (or `v-html` in Vue).
- The form never contains a `user_id` field.
- Delete is a `DELETE` request through Inertia (`router.delete`), never a plain link.
- Logout is a `POST` link (`<Link method="post" as="button">`).
- The 403 page must not leak whether a ticket exists beyond the status code.

---

## 12. Implementation map

### 12.1 Files to create or restyle

```
resources/js/
├── app.jsx                      progress color
├── Layouts/AuthenticatedLayout.jsx   nav (ink), toast mount
├── Layouts/GuestLayout.jsx           centered auth panel
├── Components/
│   ├── FlashMessage.jsx
│   ├── StatusBadge.jsx
│   ├── PriorityTag.jsx
│   ├── TicketStubCard.jsx       phone card
│   ├── TicketTable.jsx          desktop table
│   ├── TicketForm.jsx
│   ├── ConfirmDeleteModal.jsx   (wrap Breeze Modal)
│   ├── Pagination.jsx
│   ├── EmptyState.jsx
│   ├── PageHeader.jsx           title + action slot
│   └── ui/Button.jsx            variants from 7.1
├── lib/format.js                ticketNo(), formatDate()
└── Pages/ ... (Dashboard, Tickets/*, Error)
```

### 12.2 Build priority for the 2-hour exam

| Priority | Item | Rubric link |
|---|---|---|
| Must | Tailwind throughout; nav with user name, Dashboard, Tickets, New ticket, Logout | UI/UX |
| Must | Table on desktop, cards on phone; no horizontal scroll | UI/UX |
| Must | Flash messages shared via `HandleInertiaRequests`, auto and manual dismiss | UI/UX |
| Must | Inline errors, disabled submit while processing, inputs kept | Functionality |
| Must | Status and priority badges; empty state; delete confirmation | UI/UX |
| Should | Ticket stub styling, priority bars, fonts, color tokens | UI/UX polish |
| Should | Restyled auth pages | UI/UX consistency |
| Could | Dashboard counters, filters, custom 403 page, friendly validation messages | Bonus |
| Skip | Dark mode, animations, skeletons, avatars | N/A |

If time is short, build everything functional with default Breeze styles first, then apply tokens and the stub design in one pass at the end. A consistent plain interface scores higher than a half-finished fancy one.

---

## 13. Design QA checklist (map to rubric)

### UI/UX (5 pts)
- [ ] Same buttons, inputs, spacing, and radii on every page (no leftover default-Breeze gray styling mixed in)
- [ ] Phone width 360px: no horizontal scroll, cards displayed, nav usable with one thumb
- [ ] Desktop width 1280px: table readable, nothing stretched edge to edge
- [ ] Flash shown for create, update, delete, and failures; dismisses by timer and by button
- [ ] Inline errors under each invalid field; submit disabled while processing
- [ ] Priority and status badges color-coded
- [ ] Empty state shown for a brand-new account
- [ ] Nav persistent on every signed-in page, showing the user's name

### Functionality links
- [ ] Every link and form is an Inertia `<Link>` or `useForm` call; no full page reloads while moving between ticket pages
- [ ] Input values remain after a failed submit
- [ ] Edit form is pre-filled

### Final visual pass
- [ ] Browser tab titles are set
- [ ] No console errors or mixed-content warnings on the live HTTPS URL
- [ ] Fonts load on production (check the network tab) with fallbacks working if they fail
- [ ] Test with the demo account and a second account (confirm the 403 page)
