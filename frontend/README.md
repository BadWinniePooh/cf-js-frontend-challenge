# CodeFreeze Board — Weekly Frontend Challenges

Welcome! This is a friendly, low-pressure series of weekly frontend challenges built around a real-world conference scheduling board. Each week you get one small, focused task that fits comfortably inside **30–45 minutes** — no need to block out your whole evening.

The goal is to learn by doing. Every step introduces one idea, builds on the last, and leaves you with something you can actually open in a browser and show off.

---

## What we're building

The end result is a fully interactive **conference board** — a weekly schedule grid where you can browse sessions, add new ones, sort columns, and visualise room occupancy.

We get there gradually:

- **Steps 0–2** lay the visual and structural foundation using plain HTML, CSS, and your first Web Components.
- **Steps 3–7** add behaviour: events, data persistence, forms, and component coordination.
- **Steps 8–9** go further with SVG and Canvas visualisations.

The existing CSS (`ui/styles.css` and its imports) is yours from day one — you never have to worry about styling from scratch. Each challenge is about **HTML structure and JavaScript behaviour**.

---

## Atomic Design — the mental model we use

Every component we build fits into a layered design system called **Atomic Design**, introduced by Brad Frost. Think of it as a hierarchy from the tiniest UI pieces up to full page layouts:

```
Atoms  ──►  Molecules  ──►  Organisms  ──►  Templates
```

**Atoms** are the smallest indivisible building blocks — a coloured tag badge, a person's avatar chip, a CSS design token.

**Molecules** are groups of atoms working together as one reusable unit — a session card (title + tags + avatars), the navigation bar.

**Organisms** are complete, self-contained sections of the UI assembled from molecules — a day column, the full schedule board grid.

**Templates** are the page-level skeletons that arrange organisms into a layout — the `<body>`, `<header>`, and `<main>` structure.

Keeping this hierarchy in mind makes it easy to decide where a new component belongs, what it should know about, and what it should leave to its parent. A tag shouldn't know about the card that contains it; a card shouldn't know about the board.

---

## BEM — how we name CSS classes

All CSS classes in this project follow **BEM** (Block, Element, Modifier), prefixed with `cfb-` to keep everything scoped to this design system.

```
cfb-block
cfb-block__element
cfb-block--modifier
cfb-block__element--modifier
```

**Block** is a standalone, self-contained component — e.g. `cfb-card`, `cfb-tag`, `cfb-column`.

**Element** (double underscore `__`) is a part of a block that has no meaning on its own — e.g. `cfb-card__title`, `cfb-card__footer`.

**Modifier** (double dash `--`) describes a variation in appearance or state — e.g. `cfb-tag--blue`, `cfb-tag--red`, `cfb-card--travel`.

A real example from the board:

```html
<article class="cfb-card cfb-card--travel">
  <header class="cfb-card__header">
    <h3 class="cfb-card__title">Opening Keynote</h3>
  </header>
  <div class="cfb-card__tags">
    <span class="cfb-tag cfb-tag--blue">Keynote</span>
  </div>
</article>
```

The modifier `cfb-card--travel` adds the blue left-border variant without touching the base `cfb-card` styles. The element classes `cfb-card__header`, `cfb-card__title`, and `cfb-card__tags` describe parts that only make sense inside a card.

This naming convention pays off as the component tree grows: you always know at a glance which block a class belongs to, and modifiers never accidentally bleed into unrelated components.

--- 

Here's how each step maps to a layer:

| Step | Element | Layer |
|------|---------|-------|
| 0 | Static HTML board | Template |
| 1 | `<cfb-tag>` | Atom |
| 2 | `<cfb-session-card>` | Molecule |
| 3 | `<cfb-column>` | Organism |
| 4 | IndexDB | Storage |
| 5–6 | form elements | Molecule |
| 7 | `<cfb-board-orchestrator>` | Organism |
| 8 | `<cfb-timeline>` | Molecule |
| 9 | `<cfb-occupancy-chart>` | Molecule |

---

## The steps at a glance

| Step | Title | Status |
|------|-------|--------|
| 0 | The Static Board | ✅ done |
| 1 | `<cfb-tag>` — Basic Web Component |  ⬜ todo |
| 2 | `<cfb-session-card>` — Composite Component | ⬜ todo |
| 3 | Column Sorting — Pub/Sub | ⬜ todo |
| 4 | Load from IndexedDB | ⬜ todo |
| 5 | Add a Session — HTML Form Elements | ⬜ todo |
| 6 | `<cfb-session-type>` — Custom Form Element | ⬜ todo |
| 7 | `<cfb-board-orchestrator>` — Flow Control | ⬜ todo |
| 8 | `<cfb-timeline>` — SVG | ⬜ todo |
| 9 | `<cfb-occupancy-chart>` — Canvas | ⬜ todo |

Each step has its own folder (`step-0/`, `step-1/`, …) with a `README.md` that describes the goal, deliverables, constraints, and optional extras for fast finishers.

---

## Testing track

Running alongside the component steps is a **companion testing track** — a series of challenges focused on testing the same components you build, using a real browser test runner instead of JSDOM.

See [`PLAN-TEST.md`](./PLAN-TEST.md) for the full plan. The testing steps live in their own folders (`test-0/`, `test-1/`, …) and can be tackled in parallel with the component steps or as a separate session.

| Test Step | Title | Mirrors |
|-----------|-------|---------|
| T-0 | Setup — Mocha + Web Test Runner | — |
| T-1 | Atom Behaviour — `<cfb-tag>` | Step 1 |
| T-2 | Molecule Behaviour — `<cfb-session-card>` | Step 2 |
| T-3 | Pub/Sub — Events dispatched & handled | Step 3 |

### Why test in a real browser?

JSDOM does not support Custom Elements or Shadow DOM, so standard Jest setups simply cannot run these tests. `@web/test-runner` launches a real Chromium instance — the same engine your components run in — so `customElements.define()`, `connectedCallback`, and Shadow DOM all work exactly as in production.

Start with **`test-0/`** to get the toolchain up and running (≈20 minutes), then pick up individual test steps as you finish the matching component step.

---

## How to get started

Each step folder is self-contained. For Step 0, which has no JavaScript, you can just open `index.html` directly in your browser. From Step 1 onwards, a local HTTP server avoids browser restrictions on ES modules loaded from `file://` URLs.

**Install once** (requires Node.js):

```bash
npm install -g http-server
```

**Run any step:**

```bash
cd step-1
http-server . -o
```

---

## A few friendly ground rules

- **Keep it to 30–45 minutes.** If you're not done, that's completely fine — pick it up next week or share what you have. The point is the learning, not the finish line.
- **No frameworks.** Each challenge uses plain HTML, CSS, and vanilla JavaScript only. This is intentional — it's how you build a solid understanding of the platform before layering abstractions on top.
- **Extras are optional.** Each step has a list of bonus tasks for those who finish early. They're there if you want them, not because you're expected to do them all.
- **Build on what you wrote.** Each step continues from the previous one. Keep your files week to week — by the end you'll have a working app you built yourself, piece by piece.
- **Share what you make.** A short screen recording or a CodePen link is always welcome. It's fun to see the same problem solved in different ways.

Happy coding!
